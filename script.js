// NEW: 1. Preloader Initialization
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 800);
    }, 1200); // 1.2 second dramatic pause to build anticipation
});

// NEW: 2. Cinematic Scroll Animations (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal only once for performance
        }
    });
}, { threshold: 0.1 }); // Triggers when 10% of the element is visible
revealElements.forEach(el => revealObserver.observe(el));


// NEW: 3. Persistent LocalStorage Wishlist Logic
let savedWishlist = JSON.parse(localStorage.getItem('zoya_wishlist')) || [];

// Function to synchronize the UI hearts with browser memory on load
function syncWishlistUI() {
    const allCards = document.querySelectorAll('.product-card');
    allCards.forEach(card => {
        const title = card.getAttribute('data-title');
        const heart = card.querySelector('.wishlist-icon');
        
        if (savedWishlist.includes(title)) {
            heart.classList.remove('far');
            heart.classList.add('fas');
            heart.style.color = '#B76E79';
        } else {
            heart.classList.remove('fas');
            heart.classList.add('far');
            heart.style.color = '#ccc';
        }
    });
}
syncWishlistUI(); // Run immediately

// Handling Heart Clicks and updating Memory
const hearts = document.querySelectorAll('.wishlist-icon');
hearts.forEach(heart => {
    heart.addEventListener('click', function(e) {
        e.stopPropagation(); 
        const cardTitle = this.closest('.product-card').getAttribute('data-title');
        
        if (this.classList.contains('far')) {
            // Add to Memory
            savedWishlist.push(cardTitle);
            this.classList.remove('far');
            this.classList.add('fas');
            this.style.color = '#B76E79'; 
        } else {
            // Remove from Memory
            savedWishlist = savedWishlist.filter(item => item !== cardTitle);
            this.classList.remove('fas');
            this.classList.add('far');
            this.style.color = '#ccc'; 
        }
        // Save to browser
        localStorage.setItem('zoya_wishlist', JSON.stringify(savedWishlist));
    });
});

// 4. Wishlist Modal Display Logic
const wishlistModal = document.getElementById('wishlist-modal');
const openWishlistBtn = document.getElementById('open-wishlist');
const closeWishlistBtn = document.getElementById('close-wishlist');
const wishlistContainer = document.getElementById('wishlist-items-container');

openWishlistBtn.addEventListener('click', () => {
    wishlistContainer.innerHTML = '';

    if (savedWishlist.length === 0) {
        wishlistContainer.innerHTML = '<div class="empty-wishlist">Your wishlist is currently empty. Explore our archives to curate your perfect collection.</div>';
    } else {
        // Build UI based on the memory array
        savedWishlist.forEach(title => {
            const card = document.querySelector(`.product-card[data-title="${title}"]`);
            if (card) { // Safety check
                const img = card.getAttribute('data-img');
                const itemHtml = `
                    <div class="wishlist-item">
                        <img src="${img}" alt="${title}">
                        <div class="wishlist-item-info">
                            <div class="wishlist-item-title">${title}</div>
                            <div class="wishlist-item-remove" onclick="removeFromWishlist('${title}')">Remove</div>
                        </div>
                        <button class="btn-primary" style="padding: 10px 15px; font-size: 11px;" onclick="triggerInquiryFlow('${title}')">Inquire</button>
                    </div>
                `;
                wishlistContainer.insertAdjacentHTML('beforeend', itemHtml);
            }
        });
    }
    wishlistModal.classList.remove('hidden');
});

closeWishlistBtn.addEventListener('click', () => wishlistModal.classList.add('hidden'));

// Global function to remove via the wishlist menu perfectly
window.removeFromWishlist = function(productTitle) {
    savedWishlist = savedWishlist.filter(item => item !== productTitle);
    localStorage.setItem('zoya_wishlist', JSON.stringify(savedWishlist));
    syncWishlistUI(); // Update background hearts
    openWishlistBtn.click(); // Refresh modal view
};


// 5. Search Functionality Logic
const searchModal = document.getElementById('search-modal');
const openSearchBtn = document.getElementById('open-search');
const closeSearchBtn = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results-container');

openSearchBtn.addEventListener('click', () => {
    searchModal.classList.remove('hidden');
    searchInput.value = '';
    searchResultsContainer.innerHTML = '<div class="empty-wishlist">Start typing to search our archives...</div>';
    setTimeout(() => searchInput.focus(), 100); 
});

closeSearchBtn.addEventListener('click', () => searchModal.classList.add('hidden'));
searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) searchModal.classList.add('hidden');
});

searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    searchResultsContainer.innerHTML = '';

    if (query === '') {
        searchResultsContainer.innerHTML = '<div class="empty-wishlist">Start typing to search our archives...</div>';
        return;
    }

    const allCards = document.querySelectorAll('.product-card');
    let matchCount = 0;

    allCards.forEach(card => {
        const title = card.getAttribute('data-title');
        const specs = card.getAttribute('data-specs');
        const img = card.getAttribute('data-img');

        if (title.toLowerCase().includes(query) || specs.toLowerCase().includes(query)) {
            matchCount++;
            const itemHtml = `
                <div class="wishlist-item">
                    <img src="${img}" alt="${title}">
                    <div class="wishlist-item-info">
                        <div class="wishlist-item-title">${title}</div>
                    </div>
                    <button class="btn-primary" style="padding: 10px 15px; font-size: 11px;" onclick="triggerInquiryFlow('${title}')">Inquire</button>
                </div>
            `;
            searchResultsContainer.insertAdjacentHTML('beforeend', itemHtml);
        }
    });

    if (matchCount === 0) {
        searchResultsContainer.innerHTML = '<div class="empty-wishlist">No matching pieces found. Try a different term.</div>';
    }
});


// 6. "Virtual Page" Navigation System
const seeMoreBtns = document.querySelectorAll('.btn-see-more');
const backBtns = document.querySelectorAll('.btn-back');

seeMoreBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.closest('.product-section');
        document.body.classList.add('category-page-active'); 
        section.classList.add('active-page'); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        
        // Trigger animations for the newly un-hidden products
        const hiddenReveals = section.querySelectorAll('.hidden-product');
        hiddenReveals.forEach(el => {
            el.classList.remove('active'); // reset
            setTimeout(() => el.classList.add('active'), 50); // fade them in securely
        });
    });
});

function returnToHome() {
    document.body.classList.remove('category-page-active');
    const activeSec = document.querySelector('.active-page');
    if (activeSec) activeSec.classList.remove('active-page');
}

backBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        returnToHome();
        document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
    });
});

document.getElementById('nav-logo').addEventListener('click', (e) => { e.preventDefault(); returnToHome(); window.scrollTo(0,0); });
document.getElementById('nav-collections').addEventListener('click', () => { returnToHome(); });


// 7. Formatted Product Modal Logic
const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalSpecsContainer = document.getElementById('modal-specs-container');
const modalImage = document.getElementById('modal-image');
const modalInquireBtn = document.getElementById('modal-inquire-btn');

const modalTriggers = document.querySelectorAll('.modal-trigger');
modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const title = card.getAttribute('data-title');
        const imgSrc = card.getAttribute('data-img');
        const specsString = card.getAttribute('data-specs');
        const specsData = specsString.split('|');

        modalTitle.textContent = title;
        modalImage.src = imgSrc;
        modalInquireBtn.setAttribute('data-target-product', title);

        modalSpecsContainer.innerHTML = `
            <div class="spec-header"><i class="far fa-file-alt"></i> General Information</div>
            <div class="spec-row"><span>SKU</span><span>${specsData[0]}</span></div>
            <div class="spec-row"><span>Jewellery Type</span><span>${specsData[1]}</span></div>
            <div class="spec-row"><span>Gender</span><span>Women</span></div>

            <div class="spec-header"><i class="far fa-gem"></i> Diamond Information</div>
            <div class="spec-row"><span>Diamond Weight (ct)</span><span>${specsData[2]}</span></div>
            <div class="spec-row"><span>Diamond Quality</span><span>${specsData[3]}</span></div>
            <div class="spec-row"><span>Diamonds (Pcs)</span><span>${specsData[4]}</span></div>
            <div class="spec-row"><span>Diamond Shape</span><span>${specsData[5]}</span></div>

            <div class="spec-header"><i class="fas fa-layer-group"></i> Metal Information</div>
            <div class="spec-row"><span>Metal Net Weight (g)</span><span>${specsData[6]}</span></div>
            <div class="spec-row"><span>Metal Colour</span><span>${specsData[7]}</span></div>
        `;

        modal.classList.remove('hidden');
    });
});

closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });


// 8. Enquiry Tracking System
const referenceGroup = document.getElementById('reference-group');
const productReferenceInput = document.getElementById('productReference');
const inquirySelect = document.getElementById('inquiryType');

window.triggerInquiryFlow = function(productName) {
    modal.classList.add('hidden');
    wishlistModal.classList.add('hidden'); 
    searchModal.classList.add('hidden'); 
    
    referenceGroup.classList.remove('hidden');
    productReferenceInput.value = productName;
    inquirySelect.value = "specific";
    document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });
};

const cardInquireBtns = document.querySelectorAll('.product-card .btn-inquire');
cardInquireBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation(); 
        triggerInquiryFlow(this.closest('.product-card').getAttribute('data-title'));
    });
});

modalInquireBtn.addEventListener('click', function() {
    triggerInquiryFlow(this.getAttribute('data-target-product'));
});


// 9. Automated Spreadsheet Submission Logic
const bookingForm = document.getElementById('bookingForm');
const submitBtn = document.getElementById('submit-btn');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop page from refreshing
        
        // Show loading state on button
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Sending Request...";
        submitBtn.style.opacity = "0.7";

        // IMPORTANT: PASTE YOUR SHEETDB LINK INSIDE THESE QUOTES
        const SHEETDB_URL = 'https://sheetdb.io/api/v1/invgqd7zpxg5h'; 

        fetch(SHEETDB_URL, {
            method: 'POST',
            body: new FormData(bookingForm)
        })
        .then(response => response.json())
        .then(data => {
            // It worked! Show success message
            alert("✨ Thank you for reaching out! Our team has received your request and will contact you shortly to confirm your private consultation.");
            
            // Clear the form
            bookingForm.reset(); 
            document.getElementById('reference-group').classList.add('hidden');
            document.getElementById('productReference').value = "";
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = "1";
        })
        .catch(error => {
            alert("We're sorry, there was an issue sending your request. Please click the WhatsApp Concierge button to contact us directly!");
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = "1";
        });
    });// Get the button
const topButton = document.getElementById("returnToTop");

// When the user scrolls down 200px from the top, show the button
window.onscroll = function() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
};

// When the user clicks on the button, scroll to the top of the document
topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
}