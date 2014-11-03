// ==UserScript==
// @id             pantip.com-855bbc82-753b-5342-b94c-883020c381dc@scriptish
// @name           Pantip Emotion
// @version        1.0
// @namespace      
// @author         Thai Pangsakulyanont
// @description    
// @include        http://pantip.com/topic/*
// @run-at         document-end
// ==/UserScript==

var observer = new MutationObserver(callback)
refresh(document.body)
observer.observe(document.body, { childList: true, subtree: true })

function find(root, sel) {
  var out = [].slice.call(root.querySelectorAll ? root.querySelectorAll(sel) : [])
  var m = root.matches || root.mozMatchesSelector
  if (m && m.call(root, sel)) out.push(root)
  return out
}

function refresh(root) {
  find(root, '.emotion-vote-list:not([data-voteviz-added])').forEach(function(x) {
    x.dataset.votevizAdded = '1'
    var m = [].slice.call(x.querySelectorAll('.emotion-choice-score:not(.first)')).map(score)
    var out = document.createElement('div')
    var u = x.querySelector('.emotion-vote-user')
    out.className = 'voteviz'
    addVoteElements(m, out)
    u.insertBefore(out, u.firstChild)
  })
}

function addVoteElements(scores, container) {
  var a = scores.map(function(score, index) {
    return { score: score, index: index }
  })
  a.sort(function(x, y) {
    return y.score - x.score
  })
  a.forEach(function(item) {
    var score = item.score
    var index = item.index
    if (score == 0) return
    var el = document.createElement('img')
    el.src = ['/images/emotions/icon-emotion-heartlike.gif',
              '/images/emotions/icon-emotion-laugh.gif',
              '/images/emotions/icon-emotion-love.gif',
              '/images/emotions/icon-emotion-sad.gif',
              '/images/emotions/icon-emotion-horror.gif',
              '/images/emotions/icon-emotion-wow.gif'][index]
    el.style.opacity = (0.1 + 0.9 * (1 - Math.exp(score / -85))).toFixed(5)
    container.appendChild(el)
  })
}


function perc(p) {
  return (p * 100).toFixed(3) + '%'
}

function score(el) {
  return +el.textContent
}
function sum(a, b) {
  return a + b
}

function callback(mutations) {
  mutations.forEach(function(e) {
    ;[].forEach.call(e.addedNodes, function(x) {
      refresh(x)
    })
  })
}
