// Get the URL parameters
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
console.log(id);

var path = './CDN/'+id+'.json';
fetch(path)
  .then(response => response.json())
  .then(data => {
    sessionStorage.setItem('courseData', JSON.stringify(data));
    initializeCourse();
  })
  .catch(error => console.error('Error fetching data:', error));

// Step 2: Initialize the course display
function initializeCourse() {
  const courseData = JSON.parse(sessionStorage.getItem('courseData'));
  if (!courseData) return;

  // Load the first chapter by default
  loadChapter(0);

  // Add event listeners for Notes and Contents buttons
  document.getElementById('notesBtn').addEventListener('click', function () {
    const currentPDF = sessionStorage.getItem('currentPDF');
    if (currentPDF) {
      document.querySelector('.playground').innerHTML = `<iframe class="pdf-viewer" src="${currentPDF}"></iframe>`;
      setActiveButton('notesBtn');
    }
  });

  document.getElementById('contentsBtn').addEventListener('click', function () {
    const courseData = JSON.parse(sessionStorage.getItem('courseData'));
    showChapterList(courseData.chapters);
    setActiveButton('contentsBtn');
  });
}

// Step 3: Function to load a specific chapter by index
function loadChapter(index) {
  const courseData = JSON.parse(sessionStorage.getItem('courseData'));
  const chapter = courseData.chapters[index];

  // Update sessionStorage with current chapter's PDF and video
  sessionStorage.setItem('currentPDF', chapter.pdf);
  sessionStorage.setItem('currentVIDEO', chapter.videoID);

  // Update the video title and description
  document.getElementById('video-title').textContent = chapter.title;
  document.getElementById('description').textContent = chapter.desc;

  // Update the YouTube video player
  if (window.player) {
    player.loadVideoById(chapter.videoID);
  } else {
    loadYouTubeVideo(chapter.videoID);
  }

  // Activate the Notes button and load the current PDF
  document.getElementById('notesBtn').click();

  // Highlight the active chapter
  highlightActiveChapter(index);
}

// Step 4: Function to load or update YouTube video player
function loadYouTubeVideo(videoID) {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubePlayerAPIReady = function () {
    window.player = new YT.Player('ytplayer', {
      width: '100%',
      videoId: videoID
    });
  };
}

// Step 5: Function to show the list of chapters
function showChapterList(chapters) {
  const chapterList = chapters
    .map(
      (chapter, index) => `
      <div class="chapter-item" onclick="loadChapter(${index})">
        <h4>${chapter.title}</h4>
        <p>${chapter.desc}</p>
      </div>`
    )
    .join('');
  document.querySelector('.playground').innerHTML = `<div class="chapter-list">${chapterList}</div>`;
}

// Step 6: Function to highlight the active chapter
function highlightActiveChapter(index) {
  const chapterItems = document.querySelectorAll('.chapter-item');
  chapterItems.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add('chapter-active');
    } else {
      item.classList.remove('chapter-active');
    }
  });
}

// Step 7: Function to set active button
function setActiveButton(buttonId) {
  document.getElementById('notesBtn').classList.remove('active');
  document.getElementById('contentsBtn').classList.remove('active');
  document.getElementById(buttonId).classList.add('active');
}

// Attach loadChapter to global scope
window.loadChapter = loadChapter;

var currentPDF0 = sessionStorage.getItem('currentPDF');
if (currentPDF0) {
  document.querySelector('.playground').innerHTML = `<iframe class="pdf-viewer" src="${currentPDF0}"></iframe>`;
}

