export default async function handler(request, response) {
  const url = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
  const rawQ = (url.searchParams.get('q') || '').trim();
  const q = rawQ;

  const send = (body, status = 200, extraHeaders = {}) => {
    response.status(status);
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    for (const [k, v] of Object.entries(extraHeaders)) response.setHeader(k, v);
    return response.send(JSON.stringify(body));
  };

  if (!q) return send({ items: [] }, 400, { 'Cache-Control': 'no-store' });

  const norm = (v) => String(v || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  const cleanIsbn = q.replace(/[-\s]/g, '');
  const isIsbn = /^(?:97[89]\d{10}|\d{9}[0-9Xx])$/.test(cleanIsbn);

  const normalizeGoogle = (item) => {
    const v = item?.volumeInfo || {};
    const isbn = (v.industryIdentifiers || []).map(x => String(x.identifier || ''));
    const isbn13 = isbn.find(x => /^97[89]\d{10}$/.test(x));
    const isbn10 = isbn.find(x => /^\d{9}[0-9Xx]$/.test(x));
    const links = v.imageLinks || {};
    const imageCandidates = [
      links.extraLarge, links.large, links.medium, links.small,
      links.thumbnail, links.smallThumbnail
    ].filter(Boolean).map(x => String(x).replace(/^http:/, 'https:'));
    const isbnCandidates = [];
    if (isbn13) isbnCandidates.push(`https://covers.openlibrary.org/isbn/${isbn13}-L.jpg?default=false`);
    if (isbn10) isbnCandidates.push(`https://covers.openlibrary.org/isbn/${isbn10}-L.jpg?default=false`);
    const coverCandidates = [...new Set([...imageCandidates, ...isbnCandidates])];
    return {
      id: item.id,
      title: v.title || 'Sem título',
      subtitle: v.subtitle || '',
      author: (v.authors || []).join(', '),
      description: String(v.description || '').replace(/<[^>]*>/g, ''),
      publisher: v.publisher || '',
      publishedDate: v.publishedDate || '',
      pageCount: v.pageCount || '',
      categories: v.categories || [],
      isbn,
      rating: v.averageRating || null,
      ratingsCount: v.ratingsCount || 0,
      cover: coverCandidates[0] || '',
      coverFallbacks: coverCandidates.slice(1),
      infoLink: v.infoLink || ''
    };
  };

  const normalizeOpenLibrary = (doc, index) => {
    const isbn = Array.isArray(doc?.isbn) ? doc.isbn.map(String) : [];
    const isbn13 = isbn.find(x => /^97[89]\d{10}$/.test(x));
    const isbn10 = isbn.find(x => /^\d{9}[0-9Xx]$/.test(x));
    const coverCandidates = [];
    if (doc?.cover_i) coverCandidates.push(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg?default=false`);
    if (isbn13) coverCandidates.push(`https://covers.openlibrary.org/isbn/${isbn13}-L.jpg?default=false`);
    if (isbn10) coverCandidates.push(`https://covers.openlibrary.org/isbn/${isbn10}-L.jpg?default=false`);
    return {
      id: `ol-${doc?.key || index}`,
      title: doc?.title || 'Sem título',
      subtitle: '',
      author: (doc?.author_name || []).join(', '),
      description: '',
      publisher: (doc?.publisher || [])[0] || '',
      publishedDate: doc?.first_publish_year ? String(doc.first_publish_year) : '',
      pageCount: doc?.number_of_pages_median || '',
      categories: Array.isArray(doc?.subject) ? doc.subject.slice(0, 8) : [],
      isbn: isbn.slice(0, 20),
      coverFallbacks: [...new Set(coverCandidates.slice(1))],
      rating: null,
      ratingsCount: doc?.ratings_count || 0,
      cover: coverCandidates[0] || '',
      infoLink: doc?.key ? `https://openlibrary.org${doc.key}` : ''
    };
  };

  // Curated titles guarantee a useful result even if an external catalog is temporarily unavailable.
  const curated = [
    {id:'bk-o-amor-nao-e-obvio',title:'O amor não é óbvio',author:'Elayne Baeta',publisher:'Galera Record',publishedDate:'2019',pageCount:392,isbn:['9788501118264'],categories:['LGBTQ+','Romance','Ficção brasileira','Lesbian'],tags:['lgbtqia+','lésbico','romance sáfico'],cover:'https://covers.openlibrary.org/isbn/9788501118264-L.jpg?default=false'},
    {id:'bk-conectadas',title:'Conectadas',author:'Clara Alves',publisher:'Seguinte',publishedDate:'2019',pageCount:320,isbn:['9788555340895'],categories:['LGBTQ+','Romance','YA'],tags:['lgbtqia+','lésbico','sáfico'],cover:'https://covers.openlibrary.org/isbn/9788555340895-L.jpg?default=false'},
    {id:'bk-heartstopper-1',title:'Heartstopper: Dois garotos, um encontro',author:'Alice Oseman',publisher:'Seguinte',publishedDate:'2021',pageCount:269,isbn:['9788555341618'],categories:['LGBTQ+','Romance','Graphic novel'],tags:['lgbtqia+','gay','queer'],cover:'https://covers.openlibrary.org/isbn/9788555341618-L.jpg?default=false'},
    {id:'bk-vermelho-branco',title:'Vermelho, branco e sangue azul',author:'Casey McQuiston',publisher:'Seguinte',publishedDate:'2019',pageCount:392,isbn:['9788555340949'],categories:['LGBTQ+','Romance','Ficção'],tags:['lgbtqia+','gay','romance'],cover:'https://covers.openlibrary.org/isbn/9788555340949-L.jpg?default=false'},
    {id:'bk-aristoteles-dante',title:'Aristóteles e Dante descobrem os segredos do Universo',author:'Benjamin Alire Sáenz',publisher:'Seguinte',publishedDate:'2014',pageCount:392,isbn:['9788543800196'],categories:['LGBTQ+','YA','Romance'],tags:['lgbtqia+','gay','queer'],cover:'https://covers.openlibrary.org/isbn/9788543800196-L.jpg?default=false'},
    {id:'bk-um-milhao-finais',title:'Um milhão de finais felizes',author:'Vitor Martins',publisher:'Seguinte',publishedDate:'2018',pageCount:352,isbn:[],categories:['LGBTQ+','Romance','YA'],tags:['lgbtqia+','gay','brasileiro'],cover:''},
    {id:'bk-dois-morrem',title:'Os dois morrem no final',author:'Adam Silvera',publisher:'Intrínseca',publishedDate:'2021',pageCount:416,isbn:['9786555603026'],categories:['LGBTQ+','Romance','YA'],tags:['lgbtqia+','gay','queer'],cover:'https://covers.openlibrary.org/isbn/9786555603026-L.jpg?default=false'},
    {id:'bk-primeiro-morrer',title:'O primeiro a morrer no final',author:'Adam Silvera',publisher:'Intrínseca',publishedDate:'2022',pageCount:544,isbn:['9786555603514'],categories:['LGBTQ+','Romance','YA'],tags:['lgbtqia+','gay','queer'],cover:'https://covers.openlibrary.org/isbn/9786555603514-L.jpg?default=false'},
    {id:'bk-sete-maridos',title:'Os sete maridos de Evelyn Hugo',author:'Taylor Jenkins Reid',publisher:'Paralela',publishedDate:'2019',pageCount:360,isbn:['9788584391509'],categories:['LGBTQ+','Ficção','Romance'],tags:['lgbtqia+','bissexual','queer'],cover:'https://covers.openlibrary.org/isbn/9788584391509-L.jpg?default=false'},
    {id:'bk-torto-arado',title:'Torto arado',author:'Itamar Vieira Junior',publisher:'Todavia',publishedDate:'2019',pageCount:264,isbn:['9786580309320','9786580309313'],categories:['Literatura brasileira','Ficção','Realismo mágico'],tags:['literatura brasileira','autoria negra'],cover:'https://covers.openlibrary.org/isbn/9786580309320-L.jpg?default=false'},
    {id:'bk-avesso-pele',title:'O avesso da pele',author:'Jeferson Tenório',publisher:'Companhia das Letras',publishedDate:'2020',pageCount:192,isbn:['9788535933390'],categories:['Literatura brasileira','Ficção'],tags:['literatura brasileira','autoria negra','racismo'],cover:'https://covers.openlibrary.org/isbn/9788535933390-L.jpg?default=false'},
    {id:'bk-amor-solidao',title:'A gente mira no amor e acerta na solidão',author:'Ana Suy',publisher:'Paidós',publishedDate:'2022',pageCount:160,isbn:['9786555357028'],categories:['Psicologia','Amor','Relações humanas'],tags:['amor','relacionamentos','autoria brasileira'],cover:'https://covers.openlibrary.org/isbn/9786555357028-L.jpg?default=false'}
  ].map(x => ({
    ...x,
    subtitle:'',
    description:'',
    rating:null,
    ratingsCount:0,
    infoLink:'',
    coverFallbacks: x.cover ? [] : (x.isbn?.length ? [`https://covers.openlibrary.org/isbn/${x.isbn[0]}-L.jpg?default=false`] : [])
  }));

  const curatedMatches = curated.filter(b => {
    if (isIsbn) return b.isbn.some(isbn => String(isbn).replace(/[-\s]/g, '') === cleanIsbn);
    return [b.title, b.author, ...(b.tags || []), ...(b.categories || [])]
      .some(v => norm(v).includes(norm(q)) || norm(q).includes(norm(v)));
  });

  const mergeUnique = (a, b) => {
    const out = [];
    const seen = new Set();
    [...a, ...b].forEach(item => {
      const key = `${norm(item.title)}|${norm(item.author)}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    });
    return out.slice(0, 20);
  };

  // A short timeout prevents a slow external provider from making the whole Vercel function fail.
  const fetchJson = async (target, ms = 4500) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
      const r = await fetch(target, {
        headers: { accept: 'application/json', 'user-agent': 'Booklyi/1.0' },
        signal: controller.signal,
        cache: 'no-store'
      });
      if (!r.ok) return null;
      return await r.json();
    } catch (_) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  // Exact ISBN: return the local match immediately. This also makes ISBN testing independent of APIs.
  if (isIsbn && curatedMatches.length) {
    return send({ items: curatedMatches, total: curatedMatches.length, source: 'Booklyi' }, 200, { 'Cache-Control': 'no-store, max-age=0' });
  }

  const googleQueries = isIsbn ? [`isbn:${cleanIsbn}`, cleanIsbn] : [q];
  const googleUrls = googleQueries.map(gq =>
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(gq)}&maxResults=40&printType=books&orderBy=relevance`
  );

  const olSearchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=40&fields=key,title,author_name,first_publish_year,publisher,cover_i,isbn,subject,number_of_pages_median,ratings_count`;

  // Query providers in parallel instead of waiting for one provider before starting the next.
  const [googleA, googleB, olData] = await Promise.all([
    fetchJson(googleUrls[0]),
    googleUrls[1] ? fetchJson(googleUrls[1]) : Promise.resolve(null),
    fetchJson(olSearchUrl)
  ]);

  const googleItems = [googleA, googleB]
    .filter(Boolean)
    .flatMap(data => Array.isArray(data?.items) ? data.items.map(normalizeGoogle) : []);
  const olItems = Array.isArray(olData?.docs) ? olData.docs.map(normalizeOpenLibrary) : [];

  const items = mergeUnique(curatedMatches, mergeUnique(googleItems, olItems));
  if (items.length) {
    return send({
      items,
      total: items.length,
      source: [
        curatedMatches.length ? 'Booklyi' : '',
        googleItems.length ? 'Google Books' : '',
        olItems.length ? 'Open Library' : ''
      ].filter(Boolean).join(' + ')
    }, 200, { 'Cache-Control': 'no-store, max-age=0' });
  }

  // Keep the API usable even during a provider outage. The UI can then show a normal empty state
  // instead of a generic HTTP 502 error page.
  return send({
    items: [],
    total: 0,
    source: 'Booklyi',
    catalogStatus: 'temporarily_unavailable'
  }, 200, { 'Cache-Control': 'no-store, max-age=0' });
}
