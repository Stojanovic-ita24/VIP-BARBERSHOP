class LanguageManager {
  constructor() {
    this.currentLang = 'sr';
    this.translations = {};
    this.elements = {};
    
    this.init();
  }
  
  async init() {
    // Učitaj prevode
    await this.loadTranslations();
    
    // Pronađi sve elemente sa data-key atributom
    this.findTranslatableElements();
    
    // Postavi event listener-e za dugmad za jezik
    this.setupLanguageSwitcher();
    
    // Proveri localStorage za sačuvani jezik
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && this.translations[savedLang]) {
      this.changeLanguage(savedLang);
    }
  }
  
  async loadTranslations() {
    try {
      const response = await fetch('translations.json');
      this.translations = await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback na hardkodovane prevode ako fetch ne uspe
      this.translations = {
        sr: {}, en: {}, ru: {}
      };
    }
  }
  
  findTranslatableElements() {
    // Osnovni tekstovi
    this.elements = {
      // Naslov stranice
      'site_title': document.querySelector('title'),
      
      // Navigacija
      'nav_home': document.querySelector('a[href="#home"]'),
      'nav_services': document.querySelector('a[href="#services"]'),
      'nav_about': document.querySelector('a[href="#about"]'),
      'nav_video': document.querySelector('a[href="#video"]'),
      'nav_location': document.querySelector('a[href="#location"]'),
      'nav_booking': document.querySelector('a[href="#booking"]'),
      
      // Hero sekcija
      'hero_title': document.querySelector('.hero-left .display'),
      'hero_cta': document.querySelector('.hero-ctas .btn-primary'),
      'hero_lead': document.querySelector('.hero-left .lead'),
      
      // Usluge
      'services_title': document.querySelector('#services .section-header h2'),
      'services_desc': document.querySelector('#services .section-header p'),
      'service1_title': document.querySelectorAll('.service-card h3')[0],
      'service2_title': document.querySelectorAll('.service-card h3')[1],
      'service3_title': document.querySelectorAll('.service-card h3')[2],
      'service_button': document.querySelectorAll('.service-btn'),
      
      // O nama
      'about_title': document.querySelector('.about-content h2'),
      'about_text': document.querySelector('.about-content p'),
      'stats_years': document.querySelectorAll('.stats span')[0],
      'stats_clients': document.querySelectorAll('.stats span')[1],
      'stats_rating': document.querySelectorAll('.stats span')[2],
      
      // Video
      'video_title': document.querySelector('#video .section-header h2'),
      'video_desc': document.querySelector('#video .section-header p'),
      'video_caption': document.querySelector('.video-caption p'),
      
      // Lokacija
      'location_title': document.querySelector('#location .section-header h2'),
      'location_desc': document.querySelector('#location .section-header p'),
      'address_title': document.querySelectorAll('.info-card h3')[0],
      'address': document.querySelector('.info-card .address'),
      'hours_title': document.querySelectorAll('.info-card h3')[1],
      'hours': document.querySelectorAll('.info-card p')[1],
      'contact_title': document.querySelectorAll('.info-card h3')[2],
      'booking_button': document.querySelector('.info-card .btn-primary'),
      
      // Footer
      'footer_text': document.querySelector('.footer-copy'),
      
      // Floating button
      'floating_button': document.querySelector('.floating-btn-text'),
      
      // Dugmad za rezervaciju u header-u
      'nav_booking_btn': document.querySelector('.nav-btn')
    };
  }
  
  setupLanguageSwitcher() {
    // Za sve dugmad za jezik (i desktop i mobile)
    const langButtons = document.querySelectorAll('.lang-btn, .lang-option');
    
    langButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        if (lang && this.translations[lang]) {
          this.changeLanguage(lang);
          // Zatvori padajući meni ako je otvoren
          this.closeDropdown();
        }
      });
    });
    
    // Toggle za padajući meni na mobilnim
    this.setupMobileDropdown();
  }
  
  setupMobileDropdown() {
    const langToggle = document.querySelector('#langToggle');
    const langDropdown = document.querySelector('#langDropdown');
    
    if (!langToggle || !langDropdown) return;
    
    // Otvori/zatvori dropdown
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langToggle.classList.toggle('open');
      langDropdown.classList.toggle('open');
      document.body.classList.toggle('lang-dropdown-open');
    });
    
    // Zatvori dropdown kada se klikne van njega
    document.addEventListener('click', (e) => {
      if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });
    
    // Zatvori dropdown na ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });
  }
  
  closeDropdown() {
    const langToggle = document.querySelector('#langToggle');
    const langDropdown = document.querySelector('#langDropdown');
    
    if (langToggle) langToggle.classList.remove('open');
    if (langDropdown) langDropdown.classList.remove('open');
    document.body.classList.remove('lang-dropdown-open');
  }
  
  changeLanguage(lang) {
    this.currentLang = lang;
    
    // Ažuriraj aktivno dugme za sve tipove dugmadi
    document.querySelectorAll('.lang-btn, .lang-option').forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Ažuriraj current language display na mobilnom
    const langCurrent = document.querySelector('.lang-current');
    if (langCurrent) {
      // Prikazuje samo skraćenicu (SR, EN, RU)
      langCurrent.textContent = lang.toUpperCase();
    }
    
    // Ažuriraj sve tekstove
    const translation = this.translations[lang];
    
    Object.keys(this.elements).forEach(key => {
      const element = this.elements[key];
      const text = translation[key];
      
      if (element && text) {
        if (key === 'footer_text') {
          // Specijalan slučaj za footer (dodaje godinu)
          const year = new Date().getFullYear();
          element.textContent = text.replace('[year]', year);
        } else if (key === 'hero_title') {
          // HTML content za hero title
          element.innerHTML = text;
        } else if (key === 'address') {
          // HTML za adresu
          element.innerHTML = text;
        } else if (key === 'hours') {
          // HTML za radno vreme
          element.innerHTML = text;
        } else if (key === 'service_button') {
          // Više dugmadi
          element.forEach(btn => btn.textContent = text);
        } else if (element.textContent !== undefined) {
          element.textContent = text;
        }
      }
    });
    
    // Sačuvaj u localStorage
    localStorage.setItem('preferred_language', lang);
    
    // Ažuriraj lang atribut na html elementu
    document.documentElement.lang = lang;
    
    // Zatvori dropdown na mobilnom (ako je otvoren)
    this.closeDropdown();
  }
}

// Pokreni kada se stranica učita
document.addEventListener('DOMContentLoaded', () => {
  window.languageManager = new LanguageManager();
});