// About Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations and interactions
  initScrollAnimations()
  initCounterAnimations()
  initTeamInteractions()
  initTestimonialSlider()
})

// Scroll animations for sections
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
      }
    })
  }, observerOptions)

  // Observe all sections
  const sections = document.querySelectorAll(
    ".mission-section, .story-section, .values-section, .team-section, .testimonials-section",
  )
  sections.forEach((section) => {
    observer.observe(section)
  })

  // Observe cards
  const cards = document.querySelectorAll(".mission-card, .value-card, .team-member, .testimonial-card")
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
    observer.observe(card)
  })
}

// Counter animations for hero stats
function initCounterAnimations() {
  const counters = document.querySelectorAll(".stat-number")
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          counterObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

function animateCounter(element) {
  const target = Number.parseInt(element.textContent.replace(/[^\d]/g, ""))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    // Format the number with appropriate suffix
    let displayValue = Math.floor(current)
    if (element.textContent.includes("+")) {
      displayValue = displayValue.toLocaleString() + "+"
    } else {
      displayValue = displayValue.toLocaleString()
    }

    element.textContent = displayValue
  }, 16)
}

// Team member interactions
function initTeamInteractions() {
  const teamMembers = document.querySelectorAll(".team-member")

  teamMembers.forEach((member) => {
    const socialLinks = member.querySelectorAll(".member-social a")

    member.addEventListener("mouseenter", () => {
      member.style.transform = "translateY(-10px) scale(1.02)"
    })

    member.addEventListener("mouseleave", () => {
      member.style.transform = "translateY(0) scale(1)"
    })

    // Social link interactions
    socialLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        // Add ripple effect
        createRipple(e, link)

        // Simulate social media redirect (replace with actual URLs)
        setTimeout(() => {
          console.log("Redirecting to social media profile...")
        }, 300)
      })
    })
  })
}

// Testimonial slider functionality
function initTestimonialSlider() {
  const testimonials = document.querySelectorAll(".testimonial-card")
  const currentTestimonial = 0

  // Add navigation dots if there are multiple testimonials
  if (testimonials.length > 3) {
    createTestimonialNavigation()
  }

  // Auto-rotate testimonials every 5 seconds
  setInterval(() => {
    rotateTestimonials()
  }, 5000)
}

function createTestimonialNavigation() {
  const testimonialSection = document.querySelector(".testimonials-section")
  const navContainer = document.createElement("div")
  navContainer.className = "testimonial-nav"
  navContainer.innerHTML = `
        <button class="nav-btn prev-btn" onclick="previousTestimonial()">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="nav-btn next-btn" onclick="nextTestimonial()">
            <i class="fas fa-chevron-right"></i>
        </button>
    `
  testimonialSection.appendChild(navContainer)
}

function rotateTestimonials() {
  const testimonials = document.querySelectorAll(".testimonial-card")
  if (testimonials.length <= 3) return

  testimonials.forEach((testimonial, index) => {
    testimonial.style.opacity = index < 3 ? "1" : "0.3"
    testimonial.style.transform = index < 3 ? "scale(1)" : "scale(0.9)"
  })
}

// Utility function to create ripple effect
function createRipple(event, element) {
  const ripple = document.createElement("span")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `

  element.style.position = "relative"
  element.style.overflow = "hidden"
  element.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 600)
}

// Add CSS for animations
const style = document.createElement("style")
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    .mission-card,
    .value-card,
    .team-member,
    .testimonial-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .testimonial-nav {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    .nav-btn {
        width: 50px;
        height: 50px;
        border: none;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nav-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
`
document.head.appendChild(style)

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".about-hero")
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`
  }
})

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
  // Scroll-based animations can be added here
}, 10)

window.addEventListener("scroll", debouncedScroll)
