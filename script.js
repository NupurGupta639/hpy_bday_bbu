function nextScreen(screenNumber) {

    // 🔊 Play music on first click
    const music = document.getElementById('bgMusic');
    if (music && music.paused) {
        music.play();
    }

    // existing code
    const current = document.querySelector('.screen.active');
    if(current) {
        current.classList.remove('active');
        current.classList.add('exit');
        setTimeout(() => {
            current.classList.remove('exit');
        }, 800);
    }

    const next = document.getElementById('screen' + screenNumber);
    next.classList.add('active');

    if (screenNumber === 2) {
        startProgressBar();
    }
}

        // --- DATA & STATE ---
        // Default photos (Unsplash) - Used if no upload
        let photos = [
            'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80',
            'https://images.unsplash.com/photo-1482849297067-f66f41f0f95b?w=500&q=80',
            'https://images.unsplash.com/photo-1520854226103-380f64372170?w=500&q=80',
            'https://images.unsplash.com/photo-1504199139190-d7400908d330?w=500&q=80'
        ];
        
        let poppedCount = 0;
        let candleLit = false;

        // --- SCREEN NAVIGATION ---
        function nextScreen(id) {
            // Hide all active screens
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            // Show target
            const target = document.getElementById(id);
            target.style.display = 'flex';
            setTimeout(() => target.classList.add('active'), 50);

            // Trigger specific actions based on screen
            if (id === 'screen-gallery') renderStack();
        }

        // --- 1. COUNTDOWN LOGIC ---
        window.onload = () => {
            let count = 3;
            const el = document.getElementById('countdown-number');
            const timer = setInterval(() => {
                count--;
                if(count > 0) {
                    el.innerText = count;
                } else {
                    clearInterval(timer);
                    el.innerText = "0";
                    setTimeout(() => nextScreen('screen-intro'), 800);
                }
            }, 1000);
        };

        // --- 3. CAKE LOGIC ---
        function lightCandle() {
            if(candleLit) return;
            document.querySelector('.candle').style.display = 'block';
            document.querySelector('.flame').style.display = 'block';
            document.getElementById('cake-msg').innerText = "YAY! Happy Birthday! 🎂";
            document.getElementById('cake-btn').classList.remove('hidden');
            fireConfetti();
            candleLit = true;
        }

        // --- 4. BALLOON LOGIC ---
        function pop(el) {
            if(el.classList.contains('popped')) return;
            el.classList.add('popped');
            poppedCount++;
            if(poppedCount === 4) {
                document.getElementById('balloon-btn').classList.remove('hidden');
                fireConfetti();
            }
        }

        // --- 5. GALLERY LOGIC (STACK) ---
        function renderStack() {
            const container = document.getElementById('stack-container');
            container.innerHTML = ''; // Clear current
            
            photos.forEach((src, index) => {
                const card = document.createElement('div');
                card.className = 'photo-card';
                card.style.zIndex = photos.length - index;
                // Random rotation for "messy stack" look
                let rot = (Math.random() * 10) - 5; 
                card.style.transform = `rotate(${rot}deg)`;
                
                card.innerHTML = `<img src="${src}" alt="Memory">`;
                
                // Click to swipe logic
                card.onclick = () => {
                    // Animate off screen
                    card.style.transform = `translate(-150%, 50px) rotate(-20deg)`;
                    card.style.opacity = '0';
                    
                    // Move to bottom of stack after animation
                    setTimeout(() => {
                        container.prepend(card);
                        card.style.zIndex = 0;
                        card.style.transform = `rotate(${rot}deg) scale(0.95)`;
                        card.style.opacity = '1';
                        
                        // Re-adjust z-indices
                        const cards = document.querySelectorAll('.photo-card');
                        cards.forEach(c => {
                            let currentZ = parseInt(c.style.zIndex);
                            c.style.zIndex = currentZ + 1;
                        });
                    }, 600);
                };
                
                container.appendChild(card);
            });
        }

        // --- CUSTOM UPLOAD LOGIC ---
        function handleUpload(event) {
            const files = event.target.files;
            if(files.length > 0) {
                photos = []; // Reset existing
                Array.from(files).forEach(file => {
                    photos.push(URL.createObjectURL(file));
                });
                renderStack(); // Re-render immediately
            }
        }

        // --- 7. GIFT LOGIC ---
        function openGift() {
            const box = document.querySelector('.gift-box');
            if(box.classList.contains('open')) return;
            
            box.classList.add('open');
            setTimeout(() => {
                box.style.display = 'none';
                document.getElementById('gift-lbl').style.display = 'none';
                document.getElementById('final-content').classList.remove('hidden');
                fireConfetti();
                fireConfetti();
            }, 1000);
        }

        // --- CONFETTI UTILS ---
        const canvas = document.getElementById('confetti');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        function fireConfetti() {
            let particles = [];
            for(let i=0; i<100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height - canvas.height,
                    color: `hsl(${Math.random()*360}, 100%, 50%)`,
                    size: Math.random() * 10 + 5,
                    speed: Math.random() * 5 + 2
                });
            }
            
            let animationId;
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let active = false;
                particles.forEach(p => {
                    p.y += p.speed;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                    if(p.y < canvas.height) active = true;
                });
                
                if(active) requestAnimationFrame(animate);
            }
            animate();
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

    // --- BACKGROUND MUSIC AUTOPLAY ---
    const bgMusic = document.getElementById("bg-music");

    function startMusic() {
        bgMusic.volume = 0.4; // soft background volume
        bgMusic.play().catch(() => {
            console.log("Autoplay blocked until user interaction");
        });

        // Remove listeners after first interaction
        document.removeEventListener("click", startMusic);
        document.removeEventListener("touchstart", startMusic);
    }

    // First user interaction triggers music
    document.addEventListener("click", startMusic);
    document.addEventListener("touchstart", startMusic);
