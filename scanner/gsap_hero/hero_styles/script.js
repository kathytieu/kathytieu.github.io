// Split text function (free alternative to SplitText plugin)
function splitText(element) {
    const text = element.textContent;
    const originalHTML = element.innerHTML;
    element.innerHTML = '';
    
    // Define syntax patterns to look for
    const syntaxPatterns = [
        { class: 'syntax-boolean', word: 'ALL', color: 'var(--syntax-boolean)' },
        { class: 'syntax-datetime', word: 'seconds', color: 'var(--syntax-datetime)' },
        { class: 'syntax-number', word: 'tenth', color: 'var(--syntax-number)' }
    ];
    
    // Create spans for each character
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        
        // Check each syntax pattern
        syntaxPatterns.forEach(pattern => {
            if (originalHTML.includes(pattern.class) && text.includes(pattern.word)) {
                const wordStart = text.indexOf(pattern.word);
                const wordEnd = wordStart + pattern.word.length;
                if (i >= wordStart && i < wordEnd) {
                    span.style.color = pattern.color;
                }
            }
        });
        
        element.appendChild(span);
    }
    
    return element.children;
  }
  
  // Split all text-large elements
  const textLargeElements = document.querySelectorAll('.text-large');
  
  // Create a timeline for better control
  const tl = gsap.timeline();

  // Define timing variables for easy adjustment
  const resultsStartTime = 2.0;
  const resultsDuration = 0.5;
  const eventsCounterDuration = 2.0;
  const buttonDelay = 1.0; // How long after results start to show button

  // Add container fade-in animations
  const optionsElement = document.querySelector('.options');
  const queryboxElement = document.querySelector('.querybox');
  const resultsElement = document.querySelector('.results');
  const playgroundElement = document.querySelector('.options-playground');

  // Set initial state for playground button to be invisible
  gsap.set(playgroundElement, { opacity: 0, y: -20 });

  // Fade in options first
  tl.from(optionsElement, {
    duration: 0.5,
    opacity: 0,
    y: 20
  }, 0);

  // Fade in querybox second
  tl.from(queryboxElement, {
    duration: 0.5,
    opacity: 0,
    y: 20
  }, 0.3);

  // Fade in results when counters start
  tl.from(resultsElement, {
    duration: resultsDuration,
    opacity: 0,
    y: 20
  }, resultsStartTime);

  // Animate playground button relative to results timing
  tl.to(playgroundElement, {
    duration: 0.5,
    opacity: 1,
    y: 0
  }, resultsStartTime + buttonDelay);

  // Add text animations to timeline
  textLargeElements.forEach((element, index) => {
    const chars = splitText(element);
    
    // Add each text animation to the timeline
    tl.from(chars, {
      duration: 0.01, // instant appearance
      opacity: 0, // start from invisible
      stagger: 0.03, // Delay between each character
    }, index * 0.8); // Position in timeline
    
    // Add the corresponding number animation at the same time
    const numberElement = element.parentElement.querySelector('.text-medium.secondary');
    if (numberElement) {
      const numberChars = splitText(numberElement);
      tl.from(numberChars, {
        duration: 0.01,
        opacity: 0,
        stagger: 0.03,
      }, index * 0.8); // Same position as the text line
    }
  });

  // Add counter animation to timeline
  const eventsElement = document.querySelector('.results .text-medium');
  if (eventsElement) {
    const targetNumber = 4686648998;
    
    // Start with "--"
    eventsElement.textContent = "-- Events";
    
    tl.to({}, {
      duration: eventsCounterDuration, // 2 seconds to count up
      onUpdate: function() {
        const progress = this.progress();
        const currentNumber = Math.floor(targetNumber * progress);
        eventsElement.textContent = `${currentNumber.toLocaleString()} Events`;
      }
    }, resultsStartTime) // Start at the same time as other counters
    .then(() => {
      // After counter finishes, split the text and bounce each character
      const finalNumber = targetNumber.toLocaleString();
      const finalText = `${finalNumber} Events`;
      eventsElement.textContent = '';
      
      // Create spans for each character
      for (let i = 0; i < finalText.length; i++) {
        const char = finalText[i];
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        eventsElement.appendChild(span);
      }
      
      // Bounce animation for only the number characters
      const numberChars = Array.from(eventsElement.children).slice(0, finalNumber.length);
      numberChars.forEach((char, index) => {
        gsap.fromTo(char, {
          y: 0
        }, {
          y: -5,
          duration: 0.2,
          delay: index * 0.03, // Start each bounce 0.1s after the previous
          ease: "bounce.Out",
          yoyo: true,
          repeat: 1
        });
      });
    });
  }

  // Add counter animations for elapsed time and bytes scanned
  const elapsedElement = document.querySelector('.results-row-item:nth-child(2) .text-small:last-child');
  const bytesElement = document.querySelector('.results-row-item:nth-child(3) .text-small:last-child');

  if (elapsedElement) {
    const targetElapsed = 64.538;
    
    // Start with "--"
    elapsedElement.textContent = "--";
    
    tl.to({}, {
      duration: 1.5,
      onUpdate: function() {
        const progress = this.progress();
        const currentNumber = (targetElapsed * progress).toFixed(3);
        elapsedElement.textContent = `${currentNumber}s`;
      }
    }, resultsStartTime); // Start at the same time as the main counter
  }

  if (bytesElement) {
    const targetBytes = 13.1;
    const targetSpeed = 208;
    
    // Start with "--"
    bytesElement.textContent = "--";
    
    tl.to({}, {
      duration: 1.5,
      onUpdate: function() {
        const progress = this.progress();
        const currentBytes = (targetBytes * progress).toFixed(1);
        const currentSpeed = Math.floor(targetSpeed * progress);
        bytesElement.textContent = `${currentBytes} TB (${currentSpeed} GB/s)`;
      }
    }, resultsStartTime); // Start at the same time as the main counter
  }