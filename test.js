
const themes={
rosa:{accent:'#e85d8e',accent2:'#f7b2c9',bg:'#fff8fb',soft:'#fdeaf1'},
amarelo:{accent:'#d89b22',accent2:'#f2d27b',bg:'#fffcf3',soft:'#fff3c9'},
verde:{accent:'#4c9a70',accent2:'#a9d8bc',bg:'#f5fbf7',soft:'#e3f4e9'},
vermelho:{accent:'#c94d59',accent2:'#eea5ac',bg:'#fff7f7',soft:'#fde2e4'},
azul:{accent:'#4b83c4',accent2:'#a9c9eb',bg:'#f5faff',soft:'#e1effc'},
roxo:{accent:'#8561b8',accent2:'#c9b6e8',bg:'#faf7ff',soft:'#eee6fb'},
laranja:{accent:'#db7a32',accent2:'#f3bd91',bg:'#fff9f4',soft:'#fde9da'},
preto:{accent:'#5b5360',accent2:'#aaa3ad',bg:'#f5f4f6',soft:'#e6e4e8'}
};

let profile=JSON.parse(localStorage.getItem('booklyi_profile')||'null')||{
  name:'Carol',handle:'@carol.le',bio:'Amo histórias que me fazem perder a noção do tempo. ☕📚',avatar:'',followers:0,following:0,followersUsers:[],followingUsers:[]
};
profile.followersUsers=Array.isArray(profile.followersUsers)?profile.followersUsers:[];
profile.followingUsers=Array.isArray(profile.followingUsers)?profile.followingUsers:[];
profile.followers=profile.followersUsers.length;
profile.following=profile.followingUsers.length;
function saveProfileData(){profile.followers=profile.followersUsers.length;profile.following=profile.followingUsers.length;localStorage.setItem('booklyi_profile',JSON.stringify(profile))}
let books=JSON.parse(localStorage.getItem('booklyi_books') || localStorage.getItem('lumi_books')||'null')||[
{title:'A Hipótese do Amor',author:'Ali Hazelwood',status:'Lendo'},
{title:'Os Sete Maridos de Evelyn Hugo',author:'Taylor Jenkins Reid',status:'Lido'},
{title:'Verity',author:'Colleen Hoover',status:'Quero ler'},
{title:'Teto Para Dois',author:'Beth O’Leary',status:'Lido'}
];
let posts=JSON.parse(localStorage.getItem('booklyi_posts') || localStorage.getItem('lumi_posts')||'null')||[
{user:'Marina',book:'A Biblioteca da Meia-Noite',text:'Esse livro está mexendo muito comigo. Cada capítulo parece uma conversa diferente com a gente mesma.',stars:5},
{user:'Bia',book:'Verity',text:'Comecei ontem e já estou completamente presa. Preciso de alguém para discutir sem spoiler! 😭',stars:4}
];
let clubs=JSON.parse(localStorage.getItem('booklyi_clubs') || localStorage.getItem('lumi_clubs')||'null')||[
{name:'Romances que destroem nosso psicológico 💔',desc:'Para quem gosta de sofrer por personagens fictícios.',members:128,privacy:'Público'},
{name:'Café, livros & surtos ☕',desc:'Leituras variadas e muita conversa.',members:74,privacy:'Público'}
];
const communityUsers=[
{name:'Marina',handle:'@marina.livros',bio:'Romance, fantasia e livros que viram a noite.',avatar:''},
{name:'Bia',handle:'@bia.leitora',bio:'Um capítulo por vez. Café sempre. ☕',avatar:''},
{name:'Júlia',handle:'@juliacompaginas',bio:'Romances sáficos, clássicos e muita anotação.',avatar:''},
{name:'Rafa',handle:'@rafa.le',bio:'Literatura brasileira, suspense e surtos literários.',avatar:''},
{name:'Nicole',handle:'@nicole.lendo',bio:'Fantasia, YA e histórias que ficam na cabeça.',avatar:''},
{name:'Lívia',handle:'@liviasampaio',bio:'Leituras diversas e conversas sem spoiler.',avatar:''}
];
const communityProfiles={
  '@marina.livros':{followers:428,following:311,books:[['A Biblioteca da Meia-Noite','Matt Haig'],['Teto Para Dois','Beth O’Leary'],['Pessoas Normais','Sally Rooney']]},
  '@bia.leitora':{followers:276,following:198,books:[['Verity','Colleen Hoover'],['Os Sete Maridos de Evelyn Hugo','Taylor Jenkins Reid'],['A Hipótese do Amor','Ali Hazelwood']]},
  '@juliacompaginas':{followers:612,following:405,books:[['O amor não é óbvio','Elayne Baeta'],['Conectadas','Clara Alves'],['Heartstopper','Alice Oseman']]},
  '@rafa.le':{followers:351,following:267,books:[['Torto Arado','Itamar Vieira Junior'],['O Avesso da Pele','Jeferson Tenório'],['Véspera','Carla Madeira']]},
  '@nicole.lendo':{followers:489,following:530,books:[['Os Dois Morrem no Final','Adam Silvera'],['A Vida Invisível de Addie LaRue','V. E. Schwab'],['Cidade da Lua Crescente','Sarah J. Maas']]},
  '@liviasampaio':{followers:733,following:389,books:[['Aristóteles e Dante','Benjamin Alire Sáenz'],['Vermelho, Branco e Sangue Azul','Casey McQuiston'],['Torto Arado','Itamar Vieira Junior']] }
};
let feedMode=localStorage.getItem('booklyi_feed_mode')||'all';
function setFeedMode(mode,btn){feedMode=mode;localStorage.setItem('booklyi_feed_mode',mode);document.querySelectorAll('.feed-tab').forEach(x=>x.classList.remove('active'));if(btn)btn.classList.add('active');renderFeed();}
function openCommunityProfile(nameOrHandle){const u=findCommunityUser(nameOrHandle);if(!u)return;const data=communityProfiles[userKey(u)]||{followers:0,following:0,books:[]};const userPosts=posts.filter(p=>{const pu=findCommunityUser(p.user);return pu&&userKey(pu)===userKey(u);});const following=isFollowing(u.handle);const booksHtml=data.books.map(b=>`<div class="community-book-mini"><div class="community-book-cover"><div class="fallback-cover">${escapeHTML(b[0])}</div></div><b>${escapeHTML(b[0])}</b><small>${escapeHTML(b[1])}</small></div>`).join('');document.getElementById('communityProfileDetail').innerHTML=`<div class="community-profile"><div class="community-profile-head"><div class="community-profile-avatar">${personAvatar(u)}</div><div class="community-profile-main"><h2>${escapeHTML(u.name)}</h2><div class="community-profile-handle">${escapeHTML(u.handle)}</div><div class="community-profile-actions"><button class="follow-btn ${following?'following':''}" onclick="toggleFollowFromProfile('${escapeHTML(u.handle)}')">${following?'Seguindo':'Seguir'}</button></div></div></div><p class="community-profile-bio">${escapeHTML(u.bio||'')}</p><div class="community-profile-stats"><div><b>${data.followers}</b><span>seguidores</span></div><div><b>${data.following}</b><span>seguindo</span></div><div><b>${data.books.length}</b><span>livros em destaque</span></div></div><div class="section-title"><h2>📚 Leituras em destaque</h2></div><div class="community-books-grid">${booksHtml||'<div class="profile-empty" style="grid-column:1/-1">Ainda não há livros em destaque.</div>'}</div><div class="section-title" style="margin-top:20px"><h2>✨ Publicações</h2></div><div class="feed">${userPosts.length?userPosts.slice(0,6).map(p=>`<article class="post"><div class="post-head"><div class="avatar">${escapeHTML((p.user||'C')[0])}</div><div class="post-head-main"><h3>${escapeHTML(p.user||u.name)}</h3><div class="meta">está lendo <b>${escapeHTML(p.book||'Livro')}</b></div></div></div>${p.spoiler?`<div class="spoiler-box"><div class="spoiler-warning">⚠️ Contém spoiler · toque para revelar</div><p class="spoiler-text">${escapeHTML(p.text||'')}</p></div>`:`<p>${escapeHTML(p.text||'')}</p>`}<div class="stars">${stars(Number(p.stars||0))}</div></article>`).join(''):'<div class="profile-empty">Este perfil ainda não publicou nada. ✨</div>'}</div></div>`;document.querySelectorAll('#communityProfileDetail [data-profile-spoiler]').forEach(el=>el.addEventListener('click',()=>el.classList.toggle('revealed')));openModal('communityProfileModal');}
function toggleFollowFromProfile(handle){toggleFollow(handle);openCommunityProfile(handle);}

function userKey(user){return (user?.handle||user?.name||'').toLowerCase();}
function findCommunityUser(nameOrHandle){const key=String(nameOrHandle||'').toLowerCase();return communityUsers.find(u=>userKey(u)===key||String(u.name).toLowerCase()===key||String(u.handle).toLowerCase()===key)||null;}
function isFollowing(nameOrHandle){const u=findCommunityUser(nameOrHandle);return !!u && profile.followingUsers.includes(userKey(u));}
function personAvatar(u){if(u?.avatar)return `<img src="${escapeHTML(u.avatar)}" alt="">`;return escapeHTML((u?.name||'C')[0].toUpperCase());}
function personRow(u,mode='follow'){if(!u)return '';const following=isFollowing(u.handle);const isSelf=userKey(u)===userKey(profile);const button=mode==='followers'&&!isSelf?`<button class="follow-btn ${following?'following':''}" onclick="toggleFollow('${escapeHTML(u.handle)}')">${following?'Seguindo':'Seguir'}</button>`:mode==='following'&&!isSelf?`<button class="follow-btn following" onclick="toggleFollow('${escapeHTML(u.handle)}')">Seguindo</button>`:mode==='suggested'&&!isSelf?`<button class="follow-btn ${following?'following':''}" onclick="toggleFollow('${escapeHTML(u.handle)}')">${following?'Seguindo':'Seguir'}</button>`:'';return `<div class="person-row"><div class="person-avatar profile-link" onclick="openCommunityProfile('${escapeHTML(u.handle)}')">${personAvatar(u)}</div><div class="person-info profile-link" onclick="openCommunityProfile('${escapeHTML(u.handle)}')"><b>${escapeHTML(u.name)}</b><small>${escapeHTML(u.handle)} · ${escapeHTML(u.bio||'')}</small></div>${button}</div>`;}
function renderPeople(){const box=document.getElementById('discoverPeople');if(!box)return;const people=communityUsers.filter(u=>userKey(u)!==userKey(profile));box.innerHTML=people.slice(0,4).map(u=>personRow(u,'suggested')).join('');}
function toggleFollow(nameOrHandle){const u=findCommunityUser(nameOrHandle);if(!u)return;const key=userKey(u);const idx=profile.followingUsers.indexOf(key);if(idx>=0)profile.followingUsers.splice(idx,1);else profile.followingUsers.push(key);saveProfileData();renderProfile();renderFeed();renderPeople();if(document.getElementById('followersModal')?.classList.contains('show'))renderFollowersModal(window.followersModalMode||'following');}
function openFollowersModal(mode='followers'){openModal('followersModal');renderFollowersModal(mode);}
function renderFollowersModal(mode='followers'){window.followersModalMode=mode;const fb=document.getElementById('followersTabBtn'),fg=document.getElementById('followingTabBtn');if(fb)fb.classList.toggle('active',mode==='followers');if(fg)fg.classList.toggle('active',mode==='following');const box=document.getElementById('followersModalList');if(!box)return;let users=[];if(mode==='following'){users=profile.followingUsers.map(k=>findCommunityUser(k)).filter(Boolean);}else{users=profile.followersUsers.map(k=>findCommunityUser(k)).filter(Boolean);}box.innerHTML=users.length?users.map(u=>personRow(u,mode)).join(''):`<div class="profile-empty">${mode==='following'?'Você ainda não está seguindo ninguém. Explore a comunidade e encontre seus próximos perfis favoritos. ✨':'Você ainda não tem seguidores. Quando outras pessoas seguirem seu perfil, elas aparecerão aqui. 💗'}</div>`;}

function save(){localStorage.setItem('booklyi_books',JSON.stringify(books));localStorage.setItem('booklyi_posts',JSON.stringify(posts));localStorage.setItem('booklyi_clubs',JSON.stringify(clubs));saveProfileData()}
function stars(n){return '★'.repeat(n)+'☆'.repeat(5-n)}

function coverSrc(url){
  if(!url) return '';
  const u=String(url);
  if(u.startsWith('/api/cover?')) return u;
  return '/api/cover?url='+encodeURIComponent(u);
}
function coverImg(url,title,cls='real-book-cover',fallbacks=[]){
  const safeTitle=escapeHTML(title||'Capa do livro');
  const urls=[url,...(Array.isArray(fallbacks)?fallbacks:[])].filter(Boolean).map(String);
  if(!urls.length) return `<div class="fallback-cover" style="height:100%;width:100%">${safeTitle}</div>`;
  const encoded=urls.map(coverSrc).map(escapeHTML);
  const src=encoded[0];
  const next=encoded.slice(1).join('|');
  return `<img class="${cls}" src="${src}" data-cover-fallbacks="${escapeHTML(next)}" alt="Capa de ${safeTitle}" loading="lazy" onerror="coverFallback(this)">`;
}
function coverFallback(img){
  const list=(img.dataset.coverFallbacks||'').split('|').filter(Boolean);
  if(list.length){img.src=list.shift();img.dataset.coverFallbacks=list.join('|');return;}
  img.onerror=null;img.style.display='none';img.parentElement.classList.add('cover-failed');
}

function cover(t){return t.toUpperCase().split(' ').slice(0,4).join('<br>')}
function go(id){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('.nav button').forEach(x=>x.classList.toggle('active',x.dataset.page===id));if(id==='shelf')renderShelf();if(id==='clubs')renderClubs();if(id==='discover')renderDiscover();if(id==='profile')renderProfile();if(id==='home')renderFeed();window.scrollTo({top:0,behavior:'smooth'})}
function openModal(id){document.getElementById(id).classList.add('show');if(id==='themeModal')renderThemes()}
function closeModal(id){document.getElementById(id).classList.remove('show')}
function ensureSocialData(){
  posts.forEach(p=>{if(!Array.isArray(p.likes))p.likes=[];if(!Array.isArray(p.comments))p.comments=[];p.comments.forEach(c=>{if(!Array.isArray(c.likes))c.likes=[];if(!Array.isArray(c.replies))c.replies=[];c.replies.forEach(r=>{if(!Array.isArray(r.likes))r.likes=[]})});});
}
function currentUserKey(){return profile.handle||profile.name||'carol'}
function renderFeed(){
  ensureSocialData(); save();
  const feed=document.getElementById('feed'); if(!feed)return;
  const allTab=document.getElementById('feedTabAll'),followTab=document.getElementById('feedTabFollowing');
  if(allTab)allTab.classList.toggle('active',feedMode==='all');if(followTab)followTab.classList.toggle('active',feedMode==='following');
  const visiblePosts=feedMode==='following'?posts.filter(p=>{const u=findCommunityUser(p.user);return (u&&isFollowing(u.handle)) || userKey(p.user)===userKey(profile);}):posts;
  const emptyMessage=feedMode==='following'?'Você ainda não segue ninguém que tenha publicado aqui. Explore a comunidade e siga alguns leitores. ✨':'Ainda não há publicações. ✨';
  feed.innerHTML=visiblePosts.map(p=>{
    const i=posts.indexOf(p), liked=p.likes.includes(currentUserKey()), comments=p.comments||[], pu=findCommunityUser(p.user);
    return `<article class="post">
      <div class="post-head"><div class="avatar" ${pu?`onclick="openCommunityProfile('${escapeHTML(pu.handle)}')"`:''}>${escapeHTML((p.user||'C')[0])}</div><div class="post-head-main"><h3 ${pu?`onclick="openCommunityProfile('${escapeHTML(pu.handle)}')"`:''}>${escapeHTML(p.user||'Leitor')}</h3><div class="meta">está lendo <b>${escapeHTML(p.book||'Livro')}</b></div></div>${pu&&userKey(pu)!==userKey(profile)?`<button class="follow-btn post-follow ${isFollowing(pu.handle)?'following':''}" data-follow-user="${escapeHTML(pu.handle)}">${isFollowing(pu.handle)?'Seguindo':'Seguir'}</button>`:''}</div>
      ${p.spoiler?`<div class="spoiler-box" data-spoiler="${i}"><div class="spoiler-warning">⚠️ Contém spoiler · toque para revelar</div><p class="spoiler-text">${escapeHTML(p.text||'')}</p></div>`:`<p>${escapeHTML(p.text||'')}</p>`}
      ${p.stars?`<div class="stars">${stars(Number(p.stars||0))}</div>`:''}
      <div class="social-actions"><button class="social-btn ${liked?'liked':''}" data-like-post="${i}">${liked?'♥':'♡'} Curtir ${p.likes.length?`· ${p.likes.length}`:''}</button><button class="social-btn" data-toggle-comments="${i}">💬 Comentar ${comments.length?`· ${comments.length}`:''}</button><button class="social-btn" data-share-post="${i}">↗ Compartilhar</button></div>
      <div class="comments-box" id="comments-${i}" style="display:${comments.length?'grid':'none'}"><div class="comment-compose"><input class="input" id="comment-input-${i}" placeholder="Escreva um comentário…"><button class="mini-btn" data-add-comment="${i}">Enviar</button></div>
      ${comments.map((c,ci)=>{const cliked=c.likes.includes(currentUserKey());return `<div class="comment"><div class="comment-head"><div class="comment-avatar">${escapeHTML((c.user||'C')[0])}</div><div><b>${escapeHTML(c.user||'Leitor')}</b><div class="comment-meta">comentário</div></div></div><div class="comment-text">${escapeHTML(c.text||'')}</div><div><button class="social-btn ${cliked?'liked':''}" data-like-comment="${i}" data-comment-index="${ci}">${cliked?'♥':'♡'} ${c.likes.length||0}</button> <button class="social-btn" data-reply="${i}" data-comment-index="${ci}">↩ Responder</button></div><div class="reply-list">${(c.replies||[]).map((r,ri)=>{const rl=r.likes.includes(currentUserKey());return `<div class="reply"><b>${escapeHTML(r.user||'Leitor')}</b><div class="comment-text">${escapeHTML(r.text||'')}</div><button class="social-btn ${rl?'liked':''}" data-like-reply="${i}" data-comment-index="${ci}" data-reply-index="${ri}">${rl?'♥':'♡'} ${r.likes.length||0}</button></div>`}).join('')}</div><div id="reply-compose-${i}-${ci}" class="comment-compose" style="display:none;margin-top:7px"><input class="input" id="reply-input-${i}-${ci}" placeholder="Responder…"><button class="mini-btn" data-add-reply="${i}" data-comment-index="${ci}">Enviar</button></div></div>`}).join('')}</div>
    </article>`;
  }).join('') || `<div class="empty">${emptyMessage}</div>`;
  document.querySelectorAll('[data-spoiler]').forEach(el=>el.addEventListener('click',()=>el.classList.toggle('revealed')));
  document.querySelectorAll('[data-like-post]').forEach(el=>el.addEventListener('click',()=>togglePostLike(Number(el.dataset.likePost))));
  document.querySelectorAll('[data-toggle-comments]').forEach(el=>el.addEventListener('click',()=>toggleComments(Number(el.dataset.toggleComments))));
  document.querySelectorAll('[data-add-comment]').forEach(el=>el.addEventListener('click',()=>addComment(Number(el.dataset.addComment))));
  document.querySelectorAll('[data-like-comment]').forEach(el=>el.addEventListener('click',()=>toggleCommentLike(Number(el.dataset.likeComment),Number(el.dataset.commentIndex))));
  document.querySelectorAll('[data-reply]').forEach(el=>el.addEventListener('click',()=>toggleReply(Number(el.dataset.reply),Number(el.dataset.commentIndex))));
  document.querySelectorAll('[data-add-reply]').forEach(el=>el.addEventListener('click',()=>addReply(Number(el.dataset.addReply),Number(el.dataset.commentIndex))));
  document.querySelectorAll('[data-like-reply]').forEach(el=>el.addEventListener('click',()=>toggleReplyLike(Number(el.dataset.likeReply),Number(el.dataset.commentIndex),Number(el.dataset.replyIndex))));
  document.querySelectorAll('[data-share-post]').forEach(el=>el.addEventListener('click',()=>sharePost(Number(el.dataset.sharePost))));
  document.querySelectorAll('[data-follow-user]').forEach(el=>el.addEventListener('click',()=>toggleFollow(el.dataset.followUser)));
}
function togglePostLike(i){ensureSocialData();const key=currentUserKey();const arr=posts[i].likes;const n=arr.indexOf(key);if(n>=0)arr.splice(n,1);else arr.push(key);save();renderFeed()}
function toggleComments(i){const box=document.getElementById('comments-'+i);if(!box)return;box.style.display=box.style.display==='none'?'grid':'none';if(box.style.display==='grid'){const input=document.getElementById('comment-input-'+i);if(input)input.focus()}}
function addComment(i){const input=document.getElementById('comment-input-'+i);const text=(input?.value||'').trim();if(!text)return;ensureSocialData();posts[i].comments.push({user:profile.name||'Carol',text,likes:[],replies:[]});save();renderFeed();const box=document.getElementById('comments-'+i);if(box)box.style.display='grid'}
function toggleCommentLike(pi,ci){ensureSocialData();const c=posts[pi]?.comments?.[ci];if(!c)return;const key=currentUserKey(),n=c.likes.indexOf(key);if(n>=0)c.likes.splice(n,1);else c.likes.push(key);save();renderFeed()}
function toggleReply(pi,ci){const box=document.getElementById(`reply-compose-${pi}-${ci}`);if(box)box.style.display=box.style.display==='none'?'flex':'none'}
function addReply(pi,ci){const input=document.getElementById(`reply-input-${pi}-${ci}`);const text=(input?.value||'').trim();if(!text)return;ensureSocialData();posts[pi].comments[ci].replies.push({user:profile.name||'Carol',text,likes:[]});save();renderFeed();const box=document.getElementById(`reply-compose-${pi}-${ci}`);if(box)box.style.display='flex'}
function toggleReplyLike(pi,ci,ri){ensureSocialData();const r=posts[pi]?.comments?.[ci]?.replies?.[ri];if(!r)return;const key=currentUserKey(),n=r.likes.indexOf(key);if(n>=0)r.likes.splice(n,1);else r.likes.push(key);save();renderFeed()}
function sharePost(i){const p=posts[i];const text=`${p.user||'Leitor'} está lendo ${p.book||'um livro'} no Booklyi 📚✨`;if(navigator.share)navigator.share({title:'Booklyi',text}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(text).then(()=>alert('Texto copiado!')).catch(()=>{});}

let shelfFilter='Todos';
function setShelfFilter(filter,btn){
  shelfFilter=filter||'Todos';
  document.querySelectorAll('.shelf-tabs .tab').forEach(x=>x.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderShelf();
}

function renderHomeReading(){
  const box=document.getElementById('homeReading'); if(!box)return;
  const reading=books.filter(b=>b.status==='Lendo');
  if(!reading.length){
    box.innerHTML='<div class="empty">Você não está lendo nenhum livro agora. 📚✨</div>';
    return;
  }
  box.innerHTML=reading.map(b=>{
    const progress=Math.max(0,Math.min(100,Number(b.progress||0)));
    const page=Number(b.page||0), pageCount=Number(b.pageCount||0);
    const pageText=pageCount?`${page} de ${pageCount} páginas · ${progress}%`:`${progress}% da leitura`;
    const coverHtml=b.cover?coverImg(b.cover,b.title,'home-reading-img',b.coverFallbacks||[]):`<div class="fallback-cover">${escapeHTML(cover(b.title))}</div>`;
    return `<div class="post-book"><div class="home-reading-cover">${coverHtml}</div><div style="flex:1;min-width:0"><b>${escapeHTML(b.title)}</b><div class="meta">${escapeHTML(b.author||'Autor desconhecido')}</div><div class="progress"><i style="width:${progress}%"></i></div><small>${escapeHTML(pageText)}</small></div></div>`;
  }).join('');
}

function renderShelf(){
  const grid=document.getElementById('shelfGrid'); if(!grid)return;
  const filtered=shelfFilter==='Todos'?books:books.filter(b=>b.status===shelfFilter);
  grid.innerHTML=filtered.map((b)=>{
    const i=books.indexOf(b);
    const progress=b.status==='Lendo'?Number(b.progress||0):b.status==='Lido'?100:0;
    const page=Number(b.page||0), pageCount=Number(b.pageCount||0);
    const dates=[b.startedAt?`início ${formatDate(b.startedAt)}`:'',b.finishedAt?`fim ${formatDate(b.finishedAt)}`:''].filter(Boolean).join(' · ');
    return `<article class="book shelf-book-card">
      <div onclick="openShelfBook(${i})" style="cursor:pointer">
        <div class="cover">${b.cover?coverImg(b.cover,b.title,'real-book-cover',b.coverFallbacks||[]):`${cover(b.title)}`}</div>
        <b>${escapeHTML(b.title)}</b><small>${escapeHTML(b.author||'')}</small>
        <small>${escapeHTML(b.status||'Quero ler')}${b.status==='Lendo'?` · ${progress}%`:''}</small>
        ${b.rating?`<div class="stars">${stars(Number(b.rating))}</div>`:''}
        ${b.status==='Lendo'?`<div class="progress"><i style="width:${progress}%"></i></div>`:''}
        ${pageCount?`<small>📖 ${page} de ${pageCount} páginas</small>`:''}
        ${dates?`<small class="shelf-dates">${escapeHTML(dates)}</small>`:''}
      </div>
      <div style="display:flex;gap:7px;margin-top:8px">
        <button class="secondary" type="button" style="flex:1" onclick="event.stopPropagation();openShelfBook(${i})">📖 Livro</button>
        <button class="secondary" type="button" style="flex:1" onclick="event.stopPropagation();openShelfShare(${i})">📸 Instagram</button>
      </div>
      <button class="danger-inline" type="button" onclick="event.stopPropagation();removeBook(${i})">🗑️ Remover da estante</button>
    </article>`;
  }).join('')||'<div class="empty">Nenhum livro nesta parte da estante ainda.</div>';
  const reading=books.filter(b=>b.status==='Lendo').length;
  const read=books.filter(b=>b.status==='Lido').length;
  const sr=document.getElementById('statReading');if(sr)sr.textContent=reading;
  const rr=document.getElementById('statRead');if(rr)rr.textContent=read;
  renderHomeReading();
}

function openShelfShare(i){
  const b=books[i]; if(!b)return;
  const book={id:b.externalId||('local-'+i),title:b.title,author:b.author||'Autor desconhecido',cover:b.cover||'',pageCount:b.pageCount||0};
  openShareForBook(book);
}

function formatDate(value){if(!value)return '';const d=new Date(value+'T00:00:00');return isNaN(d)?value:d.toLocaleDateString('pt-BR');}
function openEditBook(i){
  const b=books[i];if(!b)return;
  window.editingBookIndex=i;
  document.getElementById('editBookTitle').value=b.title||'';
  document.getElementById('editBookAuthor').value=b.author||'';
  document.getElementById('editBookStatus').value=b.status||'Quero ler';
  document.getElementById('editBookProgress').value=Number(b.progress||0);
  document.getElementById('editProgressLabel').textContent=Number(b.progress||0)+'%';
  document.getElementById('editStarted').value=b.startedAt||'';
  document.getElementById('editFinished').value=b.finishedAt||'';
  document.getElementById('editPage').value=Number(b.page||0);
  document.getElementById('editPageCount').value=Number(b.pageCount||0);
  openModal('editBookModal');
}
function saveEditedBook(){
  const i=window.editingBookIndex,b=books[i];if(!b)return;
  const status=document.getElementById('editBookStatus').value;
  b.title=document.getElementById('editBookTitle').value.trim()||b.title;
  b.author=document.getElementById('editBookAuthor').value.trim()||b.author;
  b.status=status;
  b.progress=status==='Lido'?100:Number(document.getElementById('editBookProgress').value||0);
  b.page=Math.max(0,Number(document.getElementById('editPage').value||0));
  b.pageCount=Math.max(0,Number(document.getElementById('editPageCount').value||b.pageCount||0));
  b.startedAt=document.getElementById('editStarted').value||'';
  b.finishedAt=document.getElementById('editFinished').value||'';
  if(status==='Lendo'&&!b.startedAt)b.startedAt=new Date().toISOString().slice(0,10);
  if(status==='Lido'&&!b.finishedAt)b.finishedAt=new Date().toISOString().slice(0,10);
  if(b.pageCount)b.progress=status==='Lido'?100:Math.min(100,Math.round(b.page/b.pageCount*100));
  save();closeModal('editBookModal');renderShelf();
}
function removeEditedBook(){
  const i=window.editingBookIndex;if(i==null||!books[i])return;
  if(confirm(`Remover "${books[i].title}" da sua estante?`)){books.splice(i,1);save();closeModal('editBookModal');renderShelf();}
}
function openShelfBook(i){
  const b=books[i];if(!b)return;
  if(!b.externalId){b.externalId='local-'+Date.now()+'-'+i;save();}
  window.editingBookIndex=i;
  const idx=window.booklyiSearchResults.findIndex(x=>x.id===b.externalId);
  if(idx>=0){openRealBook(idx);return;}
  const pseudo={id:b.externalId,title:b.title,author:b.author,cover:b.cover||'',publisher:b.publisher||'',publishedDate:b.publishedDate||'',pageCount:b.pageCount||0,isbn:b.isbn||[],categories:b.categories||[],description:b.description||''};
  window.booklyiSearchResults=[pseudo];openRealBook(0);
}

function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function bookCoverUrl(b){return b.cover||''}
function renderDiscover(data){
  const grid=document.getElementById('discoverGrid');
  if(!grid)return;
  if(data){
    if(!data.length){
      grid.innerHTML='<div class="empty">Nenhum livro encontrado. Tente outro título, autor ou ISBN.</div>';
      return;
    }
    grid.innerHTML=data.map((b,i)=>`<article class="book real-book-card" onclick="openRealBook(${i})">
      <div class="cover">${b.cover?coverImg(b.cover,b.title,'real-book-cover',b.coverFallbacks||[]):`<div class="fallback-cover">${escapeHTML(b.title)}</div>`}</div>
      <b>${escapeHTML(b.title)}</b>
      <small>${escapeHTML(b.author||'Autor desconhecido')}</small>${b.tags?.length?`<div class="catalog-badge">🌈 ${escapeHTML(b.tags[0])}</div>`:''}
      ${b.rating?`<div class="stars">★ ${Number(b.rating).toFixed(1)}</div>`:''}
    </article>`).join('');
    window.booklyiSearchResults=data;
    return;
  }
  const local=[...books].slice(0,6);
  grid.innerHTML=local.map(b=>`<article class="book"><div class="cover">${cover(b.title)}</div><b>${escapeHTML(b.title)}</b><small>${escapeHTML(b.author)}</small><small>${escapeHTML(b.status)}</small></article>`).join('');
  document.getElementById('discoverClubs').innerHTML=clubs.map(c=>`<div class="club"><div class="members">👥 ${c.members} membros</div><h3>${escapeHTML(c.name)}</h3><p>${escapeHTML(c.desc)}</p><button class="secondary">Entrar no clube</button></div>`).join('');
  renderPeople();
}

window.booklyiSearchResults=[];
async function quickCatalogSearch(q){const input=document.getElementById('search');if(input)input.value=q;await searchRealBooks();}
async function searchRealBooks(){
  const input=document.getElementById('search');
  const btn=document.getElementById('realSearchBtn');
  const status=document.getElementById('realSearchStatus');
  const q=(input?.value||'').trim();
  if(!q){status.textContent='Digite um título, autor ou ISBN.';return;}
  btn.disabled=true;btn.textContent='Buscando…';status.textContent='Buscando livros reais…';
  try{
    const url='/api/books?q='+encodeURIComponent(q);
    const response=await fetch(url,{headers:{Accept:'application/json'},cache:'no-store'});
    if(!response.ok)throw new Error('books api '+response.status);
    const data=await response.json();
    const items=data.items||[];
    status.textContent=items.length?`${items.length} livro(s) encontrado(s).`:'Nenhum livro encontrado.';
    renderDiscover(items);
  }catch(err){
    console.error(err);
    status.textContent='O catálogo está sendo atualizado. Tente novamente em alguns segundos.';
    document.getElementById('discoverGrid').innerHTML='<div class="empty">O catálogo real não respondeu neste momento.</div>';
  }finally{btn.disabled=false;btn.textContent='Buscar';}
}
function openRealBook(index){
  const b=window.booklyiSearchResults[index];
  if(!b)return;
  const shelf=books.find(x=>x.externalId===b.id);
  const coverHtml=b.cover?coverImg(b.cover,b.title,'real-detail-cover',b.coverFallbacks||[]):`<div class="fallback-cover" style="height:100%;min-height:260px">${escapeHTML(b.title)}</div>`;
  document.getElementById('realBookDetail').innerHTML=`
    <div class="real-detail">
      <div>${coverHtml}</div>
      <div>
        <h2>${escapeHTML(b.title)}</h2>
        ${b.subtitle?`<div class="real-detail-meta">${escapeHTML(b.subtitle)}</div>`:''}
        <div class="real-detail-meta"><strong>${escapeHTML(b.author||'Autor desconhecido')}</strong><br>
        ${escapeHTML(b.publisher)}${b.publishedDate?' · '+escapeHTML(b.publishedDate):''}${b.pageCount?' · '+escapeHTML(String(b.pageCount))+' páginas':''}<br>
        ${escapeHTML(b.categories.join(' · '))}</div>
        ${b.rating?`<div class="stars" style="margin-top:9px">★ ${Number(b.rating).toFixed(1)} · ${b.ratingsCount||0} avaliações</div>`:''}
        <p class="real-detail-description">${escapeHTML(b.description||'Sinopse não disponível.')}</p>
        <div style="margin-top:12px"><b>Minha avaliação</b><div class="rating-picker" id="ratingPicker">${[1,2,3,4,5].map(n=>`<button aria-label="${n} estrelas" data-rating="${n}">${(shelf?.rating||0)>=n?'★':'☆'}</button>`).join('')}</div></div>
        ${shelf?.status==='Lendo'?`<div class="reading-progress"><div style="display:flex;justify-content:space-between;gap:10px"><b>Meu progresso</b><b id="progressValue">${Number(shelf.progress||0)}%</b></div><input id="progressInput" type="range" min="0" max="100" value="${Number(shelf.progress||0)}" style="width:100%;accent-color:var(--accent)"><div class="progress"><i id="detailProgressBar" style="width:${Number(shelf.progress||0)}%"></i></div><div class="progress-row"><span>${Number(shelf.page||0)} de ${Number(b.pageCount||0)} páginas</span><span>arraste para atualizar</span></div></div>`:''}
        <div class="status-row">
          ${['Quero ler','Lendo','Lido','Pausado','Abandonei'].map(s=>`<button type="button" data-status="${escapeHTML(s)}">${s}</button>`).join('')}
        </div>
        <div class="booklyi-detail-actions"><button class="primary" id="detailAddBtn" type="button">+ Adicionar à estante</button><button id="detailShareBtn" type="button">✨ Compartilhar</button></div>${shelf?`<button class="secondary" style="margin-top:8px" id="detailEditBtn" type="button">✏️ Editar minha leitura</button>`:''}
        ${shelf?`<div class="book-status">✓ Já está na sua estante como ${escapeHTML(shelf.status)}${shelf.rating?` · ${shelf.rating} estrelas`:''}</div>`:''}
      </div>
    </div>`;
  window.currentDetailBookId=b.id;
  const detail=document.getElementById('realBookDetail');
  detail.querySelectorAll('[data-rating]').forEach(btn=>btn.addEventListener('click',()=>rateRealBookById(b.id,Number(btn.dataset.rating))));
  detail.querySelectorAll('[data-status]').forEach(btn=>btn.addEventListener('click',()=>addRealBook(b,btn.dataset.status)));
  const progressInput=detail.querySelector('#progressInput');
  if(progressInput)progressInput.addEventListener('input',e=>updateRealProgress(b.id,e.target.value));
  const addBtn=detail.querySelector('#detailAddBtn'); if(addBtn)addBtn.addEventListener('click',()=>addRealBook(b,shelf?.status||'Quero ler'));
  const shareBtn=detail.querySelector('#detailShareBtn'); if(shareBtn)shareBtn.addEventListener('click',()=>openShareForBook(b));
  const editBtn=detail.querySelector('#detailEditBtn'); if(editBtn)editBtn.addEventListener('click',()=>{const idx=books.findIndex(x=>x.externalId===b.id);if(idx>=0)openEditBook(idx)});
  openModal('realBookModal');
}
function addRealBook(b,status){
  const existing=books.findIndex(x=>x.externalId===b.id);
  const previous=existing>=0?books[existing]:{};
  const item={...previous,title:b.title,author:b.author||'Autor desconhecido',status,externalId:b.id,cover:b.cover||'',publisher:b.publisher,publishedDate:b.publishedDate,pageCount:b.pageCount,isbn:b.isbn||[],rating:previous.rating||0,progress:status==='Lido'?100:(status==='Lendo'?(previous.progress||0):0),page:status==='Lendo'?(previous.page||0):0,startedAt:previous.startedAt||'',finishedAt:status==='Lido'?(previous.finishedAt||new Date().toISOString().slice(0,10)):(previous.finishedAt||'')};
  if(existing>=0)books[existing]=item;else books.unshift(item);
  save();renderShelf();closeModal('realBookModal');
  document.getElementById('realSearchStatus').textContent=`✓ ${b.title} foi adicionado à sua estante como "${status}".`;
}


function rateRealBookById(id,n){
  const b=window.booklyiSearchResults.find(x=>x.id===id); if(!b)return;
  let i=books.findIndex(x=>x.externalId===id);
  if(i<0){addRealBook(b,'Quero ler');i=books.findIndex(x=>x.externalId===id);}
  books[i].rating=n; save(); openRealBook(window.booklyiSearchResults.findIndex(x=>x.id===id));
}
function updateRealProgress(id,value){
  const i=books.findIndex(x=>x.externalId===id); if(i<0)return;
  books[i].progress=Number(value); books[i].page=books[i].pageCount?Math.round(books[i].pageCount*Number(value)/100):0; if(!books[i].startedAt)books[i].startedAt=new Date().toISOString().slice(0,10); if(Number(value)>=100){books[i].status='Lido';books[i].finishedAt=books[i].finishedAt||new Date().toISOString().slice(0,10);}
  const v=document.getElementById('progressValue'),bar=document.getElementById('detailProgressBar'); if(v)v.textContent=Number(value)+'%'; if(bar)bar.style.width=value+'%';
  save(); renderHomeReading();
}
let shareBook=null,shareStyle='soft';
const shareStyles={soft:'🌸 Soft',cozy:'🤎 Cozy',dark:'🖤 Dark Academia',botanical:'🌿 Botanical',dreamy:'💜 Dreamy',minimal:'🤍 Minimal'};
function openShareForBook(b){shareBook=b;shareStyle='soft';renderShareStyles();renderShareCard();openModal('shareModal')}
function renderShareStyles(){document.getElementById('shareStyles').innerHTML=Object.entries(shareStyles).map(([k,v])=>`<button class="share-style ${shareStyle===k?'active':''}" onclick="shareStyle='${k}';renderShareStyles();renderShareCard()">${v}</button>`).join('')}
function renderShareCard(){
  if(!shareBook)return; const shelf=books.find(x=>x.externalId===shareBook.id)||{}; const card=document.getElementById('shareCard'); card.className='share-card '+shareStyle;
  const cover=shareBook.cover?`<img class="share-cover" src="${escapeHTML(coverSrc(shareBook.cover))}" crossorigin="anonymous" alt="" onerror="this.onerror=null;this.style.display='none'">`:`<div class="share-cover-fallback">${escapeHTML(shareBook.title)}</div>`;
  const rating=Number(shelf.rating||0); const progress=shelf.status==='Lendo'?`<div class="share-progress">${Number(shelf.progress||0)}% da leitura</div>`:'';
  card.innerHTML=`<div class="share-brand">BOOKLYI</div>${cover}<div class="share-title">${escapeHTML(shareBook.title)}</div><div class="share-author">${escapeHTML(shareBook.author||'Autor desconhecido')}</div>${rating?`<div class="share-stars">${stars(rating)}</div>`:''}${progress}`;
}
async function shareCard(){
  if(!shareBook)return;
  const blob=await createShareImageBlob();
  if(!blob){downloadShareCard();return;}
  const file=new File([blob],'booklyi-leitura.png',{type:'image/png'});
  if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
    try{await navigator.share({title:`${shareBook.title} · Booklyi`,text:`Minha leitura no Booklyi 📚✨`,files:[file]});return;}catch(e){}
  }
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.download='booklyi-leitura.png';link.href=url;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  alert('Card salvo como imagem. No iPhone, abra a imagem e compartilhe pelo Instagram. 📸');
}
function shareCoverUrl(url){
  if(!url)return '';
  return '/api/cover?url='+encodeURIComponent(url);
}
function createShareImageBlob(){
  return new Promise(resolve=>{
    const w=1080,h=1350,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');
    const bg={soft:['#fdeaf1','#fff8fb'],cozy:['#5a4034','#a77c61'],dark:['#18151c','#44354b'],botanical:['#dcebdd','#f7fbf5'],dreamy:['#ded4f5','#f8efff'],minimal:['#fafafa','#eeeeee']}[shareStyle]||['#fdeaf1','#fff8fb'];
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,bg[0]);g.addColorStop(1,bg[1]);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.fillStyle=shareStyle==='dark'||shareStyle==='cozy'?'#fff':'#342a30';ctx.font='800 34px system-ui';ctx.fillText('BOOKLYI',70,85);
    const finish=()=>canvas.toBlob(resolve,'image/png',1);
    const drawText=()=>{ctx.textAlign='center';ctx.fillStyle=shareStyle==='dark'||shareStyle==='cozy'?'#fff':'#342a30';ctx.font='900 48px system-ui';const words=shareBook.title.split(' ');let lines=[],line='';for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>800){lines.push(line);line=word}else line=test}if(line)lines.push(line);lines.slice(0,3).forEach((l,i)=>ctx.fillText(l,w/2,1030+i*55));ctx.font='400 28px system-ui';ctx.globalAlpha=.72;ctx.fillText(shareBook.author||'Autor desconhecido',w/2,1210);const shelf=books.find(x=>x.externalId===shareBook.id)||{};if(shelf.rating){ctx.globalAlpha=1;ctx.font='32px system-ui';ctx.fillText(stars(shelf.rating),w/2,1260)}if(shelf.status==='Lendo'){ctx.globalAlpha=1;ctx.font='700 26px system-ui';ctx.fillText(`${Number(shelf.progress||0)}% da leitura`,w/2,1305)}ctx.globalAlpha=1;finish()};
    if(shareBook.cover){const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{const maxW=520,maxH=650,scale=Math.min(maxW/img.width,maxH/img.height),cw=img.width*scale,ch=img.height*scale,x=(w-cw)/2,y=190+(maxH-ch)/2;ctx.save();ctx.shadowColor='rgba(0,0,0,.2)';ctx.shadowBlur=35;ctx.drawImage(img,x,y,cw,ch);ctx.restore();drawText()};img.onerror=()=>{ctx.fillStyle=shareStyle==='dark'||shareStyle==='cozy'?'#806a5d':'#d783a2';ctx.fillRect(310,270,460,610);drawText()};img.src=shareCoverUrl(shareBook.cover)}else{ctx.fillStyle=shareStyle==='dark'||shareStyle==='cozy'?'#806a5d':'#d783a2';ctx.fillRect(310,270,460,610);drawText()}
  });
}
function downloadShareCard(){
  const card=document.getElementById('shareCard'); if(!card)return;
  const w=1080,h=1350,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');
  const bg={soft:['#fdeaf1','#fff8fb'],cozy:['#5a4034','#a77c61'],dark:['#18151c','#44354b'],botanical:['#dcebdd','#f7fbf5'],dreamy:['#ded4f5','#f8efff'],minimal:['#fafafa','#eeeeee']}[shareStyle]||['#fdeaf1','#fff8fb'];
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,bg[0]);g.addColorStop(1,bg[1]);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.fillStyle=shareStyle==='dark'||shareStyle==='cozy'?'#fff':'#342a30';ctx.font='800 34px system-ui';ctx.fillText('BOOKLYI',70,85);
  const finish=()=>{const link=document.createElement('a');link.download='booklyi-leitura.png';link.href=canvas.toDataURL('image/png');link.click();};
  const drawText=()=>{ctx.textAlign='center';ctx.fillStyle=shareStyle==='dark'||shareStyle==='cozy'?'#fff':'#342a30';ctx.font='900 48px system-ui';const words=shareBook.title.split(' ');let lines=[],line='';for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>800){lines.push(line);line=word}else line=test}if(line)lines.push(line);lines.slice(0,3).forEach((l,i)=>ctx.fillText(l,w/2,1030+i*55));ctx.font='400 28px system-ui';ctx.globalAlpha=.72;ctx.fillText(shareBook.author||'Autor desconhecido',w/2,1210);const shelf=books.find(x=>x.externalId===shareBook.id)||{};if(shelf.rating){ctx.globalAlpha=1;ctx.font='32px system-ui';ctx.fillText(stars(shelf.rating),w/2,1260)}ctx.globalAlpha=1;finish()};
  if(shareBook.cover){const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{const maxW=520,maxH=650,scale=Math.min(maxW/img.width,maxH/img.height),cw=img.width*scale,ch=img.height*scale,x=(w-cw)/2,y=190+(maxH-ch)/2;ctx.save();ctx.shadowColor='rgba(0,0,0,.2)';ctx.shadowBlur=35;ctx.drawImage(img,x,y,cw,ch);ctx.restore();drawText()};img.onerror=()=>{ctx.fillStyle=shareStyle==='dark'||shareStyle==='cozy'?'#806a5d':'#d783a2';ctx.fillRect(310,270,460,610);drawText()};img.src=shareCoverUrl(shareBook.cover)}else{ctx.fillStyle=shareStyle==='dark'||shareStyle==='cozy'?'#806a5d':'#d783a2';ctx.fillRect(310,270,460,610);drawText()}
}

function renderClubs(){document.getElementById('clubsGrid').innerHTML=clubs.map(c=>`<div class="club"><div class="members">👥 ${c.members} membros · ${c.privacy}</div><h3>${c.name}</h3><p>${c.desc}</p><button class="secondary">Abrir clube</button></div>`).join('')}
function showProfileTab(tab,btn){
  document.querySelectorAll('.profile-tab-clean').forEach(x=>x.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const posts=document.getElementById('profileTabPosts'), fav=document.getElementById('profileTabFavorites');
  if(posts)posts.style.display=tab==='posts'?'block':'none';
  if(fav)fav.style.display=tab==='favorites'?'block':'none';
}
function renderProfile(){
  const p=profile||{};
  const name=p.name||'Carol', handle=p.handle||'@carol.le', bio=p.bio||'';
  document.getElementById('profileName').textContent=name;
  document.getElementById('profileHandle').textContent=handle.startsWith('@')?handle:'@'+handle;
  document.getElementById('profileBio').textContent=bio;
  const avatar=document.getElementById('profileAvatar'), fallback=document.getElementById('profileAvatarFallback');
  if(p.avatar){avatar.src=p.avatar;avatar.style.display='block';fallback.style.display='none';}
  else{avatar.style.display='none';fallback.style.display='grid';fallback.textContent=(name[0]||'C').toUpperCase();}
  const ownPosts=posts.filter(x=>(x.user||'').toLowerCase()===name.toLowerCase());
  document.getElementById('profilePostsCount').textContent=ownPosts.length;
  profile.followers=profile.followersUsers.length;
  profile.following=profile.followingUsers.length;
  document.getElementById('profileFollowers').textContent=profile.followers;
  document.getElementById('profileFollowing').textContent=profile.following;
  document.getElementById('profileBooksCount').textContent=books.filter(b=>b.status==='Lido').length;
  document.getElementById('profileReading').textContent=books.filter(b=>b.status==='Lendo').length;
  document.getElementById('profileRead').textContent=books.filter(b=>b.status==='Lido').length;
  document.getElementById('profileWant').textContent=books.filter(b=>b.status==='Quero ler').length;
  const favs=books.filter(b=>Number(b.rating||0)>=4).slice(0,4);
  document.getElementById('favorites').innerHTML=favs.length?favs.map(b=>`<article class="book"><div class="cover">${b.cover?coverImg(b.cover,b.title):cover(escapeHTML(b.title))}</div><b>${escapeHTML(b.title)}</b><small>${escapeHTML(b.author||'')}</small>${b.rating?`<div class="stars">${stars(Number(b.rating))}</div>`:''}</article>`).join(''):'<div class="profile-empty" style="grid-column:1/-1">Ainda não há favoritos. Dê 4 ou 5 estrelas aos seus livros para eles aparecerem aqui. 💗</div>';
  document.getElementById('profilePosts').innerHTML=ownPosts.length?ownPosts.slice(0,5).map((post)=>`<article class="profile-post-mini"><div class="meta">📖 ${escapeHTML(post.book||'Livro')}</div>${post.spoiler?`<div class="spoiler-box" data-profile-spoiler="${escapeHTML(post.book||'')}"><div class="spoiler-warning">⚠️ Contém spoiler · toque para revelar</div><p class="spoiler-text">${escapeHTML(post.text||'')}</p></div>`:`<p>${escapeHTML(post.text||'')}</p>`}<div class="stars">${stars(Number(post.stars||0))}</div></article>`).join(''): '<div class="profile-empty">Suas publicações aparecerão aqui quando você compartilhar uma leitura. ✨</div>';
  document.querySelectorAll('[data-profile-spoiler]').forEach(el=>el.addEventListener('click',()=>el.classList.toggle('revealed')));
}

function openEditProfile(){
  document.getElementById('editProfileName').value=profile.name||'';
  document.getElementById('editProfileHandle').value=profile.handle||'';
  document.getElementById('editProfileBio').value=profile.bio||'';
  const img=document.getElementById('profilePreview'),fb=document.getElementById('profilePreviewFallback');
  if(profile.avatar){img.src=profile.avatar;img.style.display='block';fb.style.display='none';}
  else{img.style.display='none';fb.style.display='grid';fb.textContent=(profile.name||'C')[0].toUpperCase();}
  openModal('editProfileModal');
}
function prepareProfilePhoto(file){
  return new Promise((resolve,reject)=>{
    if(!file){resolve('');return;}
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const size=420,scale=Math.min(size/img.width,size/img.height,1),w=Math.max(1,Math.round(img.width*scale)),h=Math.max(1,Math.round(img.height*scale));
        const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,w,h);
        resolve(c.toDataURL('image/jpeg',.82));
      };
      img.onerror=reject;img.src=reader.result;
    };
    reader.onerror=reject;reader.readAsDataURL(file);
  });
}
function saveProfile(){
  const name=document.getElementById('editProfileName').value.trim()||'Carol';
  let handle=document.getElementById('editProfileHandle').value.trim()||'@carol.le';if(!handle.startsWith('@'))handle='@'+handle.replace(/\s+/g,'').toLowerCase();
  const bio=document.getElementById('editProfileBio').value.trim();
  const file=document.getElementById('profilePhotoInput').files[0];
  const finish=(avatar)=>{profile={...profile,name,handle,bio,avatar:avatar||profile.avatar||'',followersUsers:Array.isArray(profile.followersUsers)?profile.followersUsers:[],followingUsers:Array.isArray(profile.followingUsers)?profile.followingUsers:[]};saveProfileData();closeModal('editProfileModal');renderProfile();renderFeed();renderPeople();};
  if(file)prepareProfilePhoto(file).then(finish).catch(()=>finish(''));else finish('');
}
function shareProfile(){
  const url=location.href.split('#')[0];
  const text=`Conheça o perfil de ${profile.name||'Carol'} no Booklyi 📚✨`;
  if(navigator.share){navigator.share({title:`${profile.name||'Carol'} no Booklyi`,text,url}).catch(()=>{});}
  else if(navigator.clipboard){navigator.clipboard.writeText(url).then(()=>alert('Link do perfil copiado!')).catch(()=>alert(url));}
  else alert(url);
}
function renderThemes(){document.getElementById('themes').innerHTML=Object.entries(themes).map(([name,t])=>`<button class="theme" onclick="setTheme('${name}')"><span class="dot" style="background:${t.accent}"></span><b>${name[0].toUpperCase()+name.slice(1)}</b></button>`).join('')}
function setTheme(name){let t=themes[name];for(let k in t)document.documentElement.style.setProperty('--'+(k==='accent2'?'accent2':k),t[k]);localStorage.setItem('booklyi_theme',name);closeModal('themeModal')}
let postRating=0,postSelectedBook=null,postSearchTimer=null;
function renderPostStars(){const el=document.getElementById('postStars');if(!el)return;el.innerHTML=[1,2,3,4,5].map(n=>`<button type="button" aria-label="${n} estrelas">${n<=postRating?'★':'☆'}</button>`).join('');el.querySelectorAll('button').forEach((btn,i)=>btn.addEventListener('click',()=>{postRating=i+1;renderPostStars()}));}
async function searchPostBooks(){const q=document.getElementById('postBook').value.trim(),box=document.getElementById('postBookSuggestions');if(!box)return;if(!q){box.innerHTML='';postSelectedBook=null;return;}box.innerHTML='<div style="color:var(--muted);font-size:12px;padding:4px">Procurando no catálogo…</div>';try{const r=await fetch('/api/books?q='+encodeURIComponent(q),{headers:{Accept:'application/json'},cache:'no-store'});if(!r.ok)throw new Error('search '+r.status);const data=await r.json();const items=(data.items||[]).slice(0,5);box.innerHTML=items.length?items.map((b,i)=>`<div class="book-suggestion" data-post-index="${i}">${b.cover?`<img src="${escapeHTML(coverSrc(b.cover))}" alt="" onerror="this.onerror=null;this.style.display='none'">`:'<div style="width:34px;height:50px;border-radius:5px;background:var(--soft)"></div>'}<div><b>${escapeHTML(b.title)}</b><div style="font-size:12px;color:var(--muted)">${escapeHTML(b.author||'Autor desconhecido')}</div></div></div>`).join(''):'<div style="color:var(--muted);font-size:12px;padding:4px">Não encontrei esse livro. Você ainda pode publicar pelo nome digitado.</div>';box.querySelectorAll('[data-post-index]').forEach(el=>el.addEventListener('click',()=>{postSelectedBook=items[Number(el.dataset.postIndex)];document.getElementById('postBook').value=postSelectedBook.title;box.innerHTML=`<div style="font-size:12px;color:var(--accent);font-weight:700">✓ ${escapeHTML(postSelectedBook.title)} · ${escapeHTML(postSelectedBook.author||'')}</div>`;}));}catch(e){box.innerHTML='<div style="color:var(--muted);font-size:12px;padding:4px">Não consegui consultar o catálogo agora.</div>';}}
function addPost(){let book=document.getElementById('postBook').value.trim(),text=document.getElementById('postText').value.trim(),spoiler=document.getElementById('postSpoiler').checked;if(!book||!text)return alert('Preencha o livro e o que você está achando da leitura.');posts.unshift({user:profile.name||'Carol',book,text,stars:postRating,spoiler,bookData:postSelectedBook||null});save();renderFeed();closeModal('postModal');document.getElementById('postBook').value='';document.getElementById('postText').value='';document.getElementById('postSpoiler').checked=false;postRating=0;postSelectedBook=null;document.getElementById('postBookSuggestions').innerHTML='';renderPostStars();go('home')}
function addBook(){let title=document.getElementById('bookTitle').value.trim(),author=document.getElementById('bookAuthor').value.trim(),status=document.getElementById('bookStatus').value;if(!title||!author)return alert('Preencha título e autor.');books.unshift({title,author,status,externalId:'local-'+Date.now(),rating:0,progress:status==='Lido'?100:0,page:0,pageCount:0,startedAt:status==='Lendo'?new Date().toISOString().slice(0,10):'',finishedAt:status==='Lido'?new Date().toISOString().slice(0,10):''});save();renderShelf();closeModal('bookModal');document.getElementById('bookTitle').value='';document.getElementById('bookAuthor').value='';go('shelf')}
function removeBook(i){if(i<0||!books[i])return;if(confirm(`Remover "${books[i].title}" da estante?`)){books.splice(i,1);save();renderShelf();renderProfile();}}
function addClub(){let name=document.getElementById('clubName').value.trim(),desc=document.getElementById('clubDesc').value.trim(),privacy=document.getElementById('clubPrivacy').value;if(!name)return alert('Dê um nome ao clube.');clubs.unshift({name,desc:desc||'Um novo clube de leitura.',members:1,privacy});save();renderClubs();closeModal('clubModal');document.getElementById('clubName').value='';document.getElementById('clubDesc').value='';go('clubs')}

const realSearchBtn=document.getElementById('realSearchBtn');
const realSearchInput=document.getElementById('search');
if(realSearchBtn)realSearchBtn.addEventListener('click',searchRealBooks);
if(realSearchInput)realSearchInput.addEventListener('keydown',e=>{if(e.key==='Enter')searchRealBooks();});

const postBookInput=document.getElementById('postBook');
if(postBookInput)postBookInput.addEventListener('input',()=>{clearTimeout(postSearchTimer);postSearchTimer=setTimeout(searchPostBooks,450)});
renderPostStars();

const saved=localStorage.getItem('booklyi_theme') || localStorage.getItem('lumi_theme');if(saved&&themes[saved])setTheme(saved);else setTheme('rosa');renderFeed();renderShelf();renderDiscover();renderClubs();renderProfile();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js?v=20260929-v11-followers');
