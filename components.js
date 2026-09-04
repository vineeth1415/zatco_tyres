/* ZATCO Component Loader & Global Tyre Rolling Preloader */
(function () {
    // 1. Inject Preloader Styles & DOM immediately on page access
    function createPreloader() {
        if (document.getElementById('zatco-preloader')) return;

        var style = document.createElement('style');
        style.id = 'zatco-preloader-styles';
        style.textContent = `
            @keyframes zatcoSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes zatcoRoad {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            @keyframes zatcoPulse {
                0%, 100% { opacity: 0.7; transform: scale(0.98); }
                50% { opacity: 1; transform: scale(1.02); }
            }
        `;
        document.head.appendChild(style);

        var preloader = document.createElement('div');
        preloader.id = 'zatco-preloader';
        preloader.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background-color: #050505; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease, visibility 0.4s ease; opacity: 1; visibility: visible; pointer-events: auto;';

        preloader.innerHTML = `
            <div style="position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; inset: -10px; border: 2px dashed rgba(187, 1, 18, 0.5); border-radius: 50%; animation: zatcoSpin 4s linear infinite reverse;"></div>
                
                <!-- Rotating Wheel Assembly with Attached Exact Z Emblem -->
                <div style="position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; animation: zatcoSpin 0.9s linear infinite;">
                    <img src="images/rolling_hero_tyre.png" alt="Rolling Tyre" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 15px rgba(187, 1, 18, 0.6));" onerror="this.style.opacity='0.4';">
                    
                    <!-- Attached Z Logo Emblem in Center Wheel Hub -->
                    <div style="position: absolute; width: 56px; height: 56px; border-radius: 50%; background: #000000; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 0 15px rgba(255, 255, 255, 0.8); z-index: 10;">
                        <img src="images/zatco_z_symbol.png" alt="ZATCO Z Emblem" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                </div>
            </div>
            
            <div style="width: 160px; height: 3px; background: rgba(255,255,255,0.1); margin-top: 24px; border-radius: 99px; overflow: hidden; position: relative;">
                <div style="width: 200%; height: 100%; background: linear-gradient(90deg, #bb0112 0%, #ffffff 50%, #bb0112 100%); animation: zatcoRoad 1s linear infinite;"></div>
            </div>

            <div style="margin-top: 18px; font-family: system-ui, -apple-system, sans-serif; font-weight: 800; letter-spacing: 3px; color: #ffffff; font-size: 13px; text-transform: uppercase; text-align: center; animation: zatcoPulse 1.4s ease-in-out infinite;">
                <span style="color: #bb0112;">ZATCO</span> TYRES
            </div>
            <div style="font-family: monospace; font-size: 10px; color: #94a3b8; margin-top: 6px; letter-spacing: 1.5px; text-transform: uppercase;">
                Loading High-Performance Fitments...
            </div>
        `;

        if (document.body) {
            document.body.prepend(preloader);
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                document.body.prepend(preloader);
            });
        }
    }

    function hidePreloader() {
        var loader = document.getElementById('zatco-preloader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            setTimeout(function () {
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 400);
        }
    }

    // Run preloader creation immediately when components.js loads
    createPreloader();

    function loadComponent(selector, file, callback) {
        var elem = document.querySelector(selector);
        if (!elem) return;
        fetch(file)
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to load ' + file);
                return response.text();
            })
            .then(function (html) {
                var temp = document.createElement('div');
                temp.innerHTML = html.trim();
                if (elem.parentNode) {
                    var fragment = document.createDocumentFragment();
                    while (temp.firstChild) {
                        fragment.appendChild(temp.firstChild);
                    }
                    elem.parentNode.replaceChild(fragment, elem);
                }
                if (callback) callback();
            })
            .catch(function (err) {
                console.error('Component load error:', err);
                if (callback) callback();
            });
    }

    function highlightActiveNav() {
        var path = window.location.pathname.split('/').pop() || 'home.html';
        if (path === '' || path === 'index.html') {
            path = 'home.html';
        }

        var navLinks = document.querySelectorAll('header nav a');
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === path) {
                link.className = "text-[#bb0112] border-b-2 border-[#bb0112] py-2 font-bold transition-all duration-200";
            } else {
                link.className = "text-black font-bold hover:text-[#bb0112] border-b-2 border-transparent hover:border-[#bb0112] py-2 transition-all duration-200";
            }
        });
    }

    function init() {
        var loadedCount = 0;
        var totalComponents = 2;

        function checkComplete() {
            loadedCount++;
            if (loadedCount >= totalComponents) {
                setTimeout(hidePreloader, 400);
            }
        }

        var headerTarget = document.querySelector('#header-placeholder') || document.querySelector('header');
        if (headerTarget) {
            loadComponent('#header-placeholder, header', 'header.html', function () {
                highlightActiveNav();
                checkComplete();
            });
        } else {
            checkComplete();
        }

        var footerTarget = document.querySelector('#footer-placeholder') || document.querySelector('footer');
        if (footerTarget) {
            loadComponent('#footer-placeholder, footer', 'footer.html', checkComplete);
        } else {
            checkComplete();
        }

        // Fallback hide after 1.5s
        setTimeout(hidePreloader, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
