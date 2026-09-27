/* ZATCO Component Loader & Global Tyre Rolling Preloader */
(function () {
    // 0. Inject Browser Title Favicon Logo
    function injectFavicon() {
        var existingFavicon = document.querySelector("link[rel*='icon']");
        if (!existingFavicon) {
            var link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/png';
            link.href = 'images/zatco_z_symbol.png';
            document.head.appendChild(link);

            var shortcutLink = document.createElement('link');
            shortcutLink.rel = 'shortcut icon';
            shortcutLink.type = 'image/png';
            shortcutLink.href = 'images/zatco_z_symbol.png';
            document.head.appendChild(shortcutLink);
        } else {
            existingFavicon.href = 'images/zatco_z_symbol.png';
        }
    }
    injectFavicon();

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
        `;
        document.head.appendChild(style);

        var preloader = document.createElement('div');
        preloader.id = 'zatco-preloader';
        preloader.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background-color: #050505; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease, visibility 0.4s ease; opacity: 1; visibility: visible; pointer-events: auto;';

        preloader.innerHTML = `
            <div style="position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center;">
                <!-- 1D Rolling Tyre with ZATCO's Main Logo Inside -->
                <div style="width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; animation: zatcoSpin 1s linear infinite; filter: drop-shadow(0 0 14px rgba(187, 1, 18, 0.45));">
                    <img src="images/rolling_tyre_1d.svg" alt="1D Rolling Tyre" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
            </div>
            
            <!-- Static Non-Animated Loading Road Line -->
            <div style="width: 140px; height: 2px; background: #bb0112; margin-top: 24px; border-radius: 99px; opacity: 0.85;"></div>

            <!-- Static Non-Animated Brand Title -->
            <div style="margin-top: 14px; font-family: system-ui, -apple-system, sans-serif; font-weight: 800; letter-spacing: 3px; color: #ffffff; font-size: 13px; text-transform: uppercase; text-align: center;">
                <span style="color: #bb0112;">ZATCO</span> TYRES
            </div>
            <div style="font-family: monospace; font-size: 10px; color: #94a3b8; margin-top: 5px; letter-spacing: 1.5px; text-transform: uppercase;">
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
