// ===== DOM REFS =====
const $ = id => document.getElementById(id);
const homeScreen = $('home-screen');
const resultScreen = $('result-screen');
const loadingScreen = $('loading-screen');
const topicInput = $('topic-input');
const charCount = $('char-count');
const generateBtn = $('generate-btn');
const backBtn = $('back-btn');
const copyAllBtn = $('copy-all-btn');
const regenBtn = $('regen-btn');
const topicDisplay = $('topic-display');
const titlesList = $('titles-list');
const descText = $('desc-text');
const tagsCloud = $('tags-cloud');
const captionText = $('caption-text');
const toast = $('toast');
const toastMsg = $('toast-msg');

let currentTopic = '';

// ===== CHAR COUNT =====
topicInput.addEventListener('input', () => {
  charCount.textContent = topicInput.value.length;
});

// ===== QUICK TAGS =====
document.querySelectorAll('.quick-tag').forEach(btn => {
  btn.addEventListener('click', () => {
    topicInput.value = btn.dataset.text;
    charCount.textContent = topicInput.value.length;
    topicInput.focus();
  });
});

// ===== SCREEN NAVIGATION =====
function showScreen(screen) {
  [homeScreen, resultScreen, loadingScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

// ===== TOAST =====
function showToast(msg = 'Copied!') {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== COPY HELPER =====
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!')).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied!');
  });
}

// ===== CONTENT GENERATION ENGINE =====
function generateContent(topic) {
  const t = topic.trim().toLowerCase();
  const cap = w => w.charAt(0).toUpperCase() + w.slice(1);
  const titleCase = s => s.split(' ').map(cap).join(' ');
  const topicTitle = titleCase(topic.trim());
  const yr = new Date().getFullYear();

  // --- TITLES ---
  const titleTemplates = [
    `${topicTitle} - Complete Guide ${yr} 🔥`,
    `${topicTitle} | Top 10 Things You MUST Know!`,
    `How to ${topicTitle} Like a Pro (Step by Step)`,
    `${topicTitle} in ${yr} - Everything Changed!`,
    `${topicTitle} for Beginners - Full Tutorial`,
    `I Tried ${topicTitle} for 30 Days - Here's What Happened`,
    `${topicTitle} Tips & Tricks Nobody Tells You!`,
    `The TRUTH About ${topicTitle} (Not Clickbait)`,
    `${topicTitle} - Watch This Before You Start!`,
    `${topicTitle} Explained in 10 Minutes ⚡`,
  ];
  // Shuffle and pick 6
  const titles = titleTemplates.sort(() => Math.random() - 0.5).slice(0, 6);

  // --- DESCRIPTION ---
  const desc = `Welcome to this comprehensive video about ${topicTitle}! 🎬

In this video, we dive deep into ${topic.trim()} and cover everything you need to know in ${yr}. Whether you're a beginner just getting started or someone looking to level up your knowledge, this guide has something for everyone.

📌 What You'll Learn:
• Complete overview of ${topicTitle}
• Expert tips and proven strategies
• Common mistakes to avoid
• Step-by-step walkthrough
• Pro tips for best results

⏰ Timestamps:
0:00 - Introduction
1:30 - Overview & Basics
4:00 - Deep Dive
8:00 - Tips & Tricks
11:00 - Common Mistakes
13:00 - Final Thoughts

👍 If you found this video helpful, please LIKE, SHARE, and SUBSCRIBE for more content like this!

🔔 Turn on notifications so you never miss an update!

📱 Follow us on social media for daily tips:
Instagram: @yourchannel
Twitter: @yourchannel

#${t.replace(/\s+/g, '')} #${t.split(' ')[0]} #youtube #trending${yr}

⚠️ Disclaimer: This video is for educational purposes only.`;

  // --- TAGS ---
  const words = t.split(/\s+/).filter(w => w.length > 2);
  const baseTags = [
    topic.trim(),
    `${topic.trim()} ${yr}`,
    `${topic.trim()} tutorial`,
    `${topic.trim()} for beginners`,
    `${topic.trim()} guide`,
    `${topic.trim()} tips`,
    `${topic.trim()} in hindi`,
    `best ${topic.trim()}`,
    `${topic.trim()} review`,
    `how to ${topic.trim()}`,
    `${topic.trim()} explained`,
    `${topic.trim()} tricks`,
    `${topic.trim()} ${yr} new`,
    `top ${topic.trim()}`,
    `${topic.trim()} complete guide`,
  ];
  const extraTags = ['trending', 'viral', 'youtube', 'tutorial', 'howto', 'tips and tricks', `trending ${yr}`];
  const tags = [...baseTags, ...extraTags].slice(0, 20);

  // --- INSTAGRAM CAPTION ---
  const emojis = ['🔥', '💯', '✨', '🚀', '💡', '🎯', '⚡', '🙌', '👇', '📱'];
  const randEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

  const caption = `${randEmoji()} ${topicTitle} ${randEmoji()}

Stop scrolling — you NEED to see this! ${randEmoji()}

We just dropped a brand new video on ${topicTitle} and honestly, it's a game-changer. Whether you've been curious about this or you're already deep into it, this one's packed with value you won't find anywhere else.

${randEmoji()} Here's a sneak peek of what's inside:
✅ Everything you need to know about ${topicTitle}
✅ Tips that actually work
✅ Mistakes most people make (and how to avoid them)
✅ The ultimate step-by-step breakdown

💬 Drop a "🔥" in the comments if you're excited!
📌 Save this post for later — you'll thank yourself.
🔗 Link in bio for the full video!

Follow @yourchannel for more content like this daily! 🙌

#${t.replace(/\s+/g, '')} #${words[0] || 'content'} #trending #viral #explore #reels #${words[0] || 'tips'}tips #contentcreator #youtuber #growyourchannel #${yr}trends #motivation #educational #mustwatch #fyp`;

  return { titles, desc, tags, caption };
}

// ===== LOADING ANIMATION =====
async function animateLoading() {
  const steps = [$('step1'), $('step2'), $('step3'), $('step4')];
  const subs = ['Crafting YouTube titles...', 'Writing SEO description...', 'Generating tags...', 'Creating Instagram caption...'];

  for (let i = 0; i < steps.length; i++) {
    steps[i].classList.add('active');
    $('loading-sub').textContent = subs[i];
    await new Promise(r => setTimeout(r, 600));
    steps[i].classList.remove('active');
    steps[i].classList.add('done');
    steps[i].innerHTML = '✅ ' + steps[i].textContent.slice(2).trim();
  }
  await new Promise(r => setTimeout(r, 400));

  // Reset steps for next time
  steps.forEach((s, i) => {
    s.classList.remove('active', 'done');
    s.innerHTML = ['🎯 YouTube Titles', '📋 SEO Description', '#️⃣ Tags', '📸 Instagram Caption'][i];
  });
}

// ===== RENDER RESULTS =====
function renderResults(data) {
  // Titles
  titlesList.innerHTML = '';
  data.titles.forEach((title, i) => {
    const div = document.createElement('div');
    div.className = 'title-item';
    div.innerHTML = `<span class="title-num">${i + 1}</span><span class="title-text">${title}</span>`;
    div.addEventListener('click', () => copyText(title));
    titlesList.appendChild(div);
  });

  // Description
  descText.textContent = data.desc;

  // Tags
  tagsCloud.innerHTML = '';
  data.tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag-chip';
    span.textContent = '#' + tag.replace(/\s+/g, '');
    span.addEventListener('click', () => copyText(tag));
    tagsCloud.appendChild(span);
  });

  // Caption
  captionText.textContent = data.caption;
}

// ===== GENERATE CLICK =====
generateBtn.addEventListener('click', async () => {
  const topic = topicInput.value.trim();
  if (!topic) {
    topicInput.style.borderColor = 'var(--red)';
    topicInput.style.boxShadow = '0 0 0 3px rgba(255,65,108,.15)';
    setTimeout(() => { topicInput.style.borderColor = ''; topicInput.style.boxShadow = ''; }, 1500);
    topicInput.focus();
    return;
  }

  currentTopic = topic;
  topicDisplay.textContent = topic;

  // Show loading
  showScreen(loadingScreen);

  // Generate content while showing animation
  const [data] = await Promise.all([
    Promise.resolve(generateContent(topic)),
    animateLoading()
  ]);

  renderResults(data);
  showScreen(resultScreen);
});

// ===== BACK BUTTON =====
backBtn.addEventListener('click', () => showScreen(homeScreen));

// ===== REGENERATE =====
regenBtn.addEventListener('click', async () => {
  showScreen(loadingScreen);
  const [data] = await Promise.all([
    Promise.resolve(generateContent(currentTopic)),
    animateLoading()
  ]);
  renderResults(data);
  showScreen(resultScreen);
});

// ===== COPY ALL =====
copyAllBtn.addEventListener('click', () => {
  const allTitles = Array.from(titlesList.querySelectorAll('.title-text')).map(el => el.textContent).join('\n');
  const allTags = Array.from(tagsCloud.querySelectorAll('.tag-chip')).map(el => el.textContent).join(', ');
  const full = `=== YOUTUBE TITLES ===\n${allTitles}\n\n=== SEO DESCRIPTION ===\n${descText.textContent}\n\n=== TAGS ===\n${allTags}\n\n=== INSTAGRAM CAPTION ===\n${captionText.textContent}`;
  copyText(full);
});

// ===== SECTION COPY BUTTONS =====
document.querySelectorAll('.section-copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.section;
    let text = '';
    if (section === 'titles') {
      text = Array.from(titlesList.querySelectorAll('.title-text')).map(el => el.textContent).join('\n');
    } else if (section === 'desc') {
      text = descText.textContent;
    } else if (section === 'tags') {
      text = Array.from(tagsCloud.querySelectorAll('.tag-chip')).map(el => el.textContent).join(', ');
    } else if (section === 'caption') {
      text = captionText.textContent;
    }
    copyText(text);
  });
});
