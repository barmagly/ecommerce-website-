import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMG = "https://via.placeholder.com/300x200?text=No+Image";

const products = [
  {
    id: "1",
    name: "شاشة LCD",
    price: 650,
    oldPrice: 800,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
      "https://images.samsung.com/is/image/samsung/p6pim/eg/ua43au7000uxeg/gallery/eg-uhd-au7000-ua43au7000uxeg-530347991?$650_519_PNG$",
      "https://cdn.lg.com/eg/images/tvs/md07501399/gallery/medium01.jpg"
    ],
    rating: 4.5,
    reviews: 128,
    description: "شاشة LCD عالية الدقة مع تقنية IPS. شاشة مثالية لمشاهدة الأفلام والألعاب والعمل المكتبي مع ألوان واقعية وزوايا رؤية واسعة.",
    details: "تتميز هذه الشاشة بتقنية متقدمة لعرض الصور بدقة عالية وتدرج لوني واسع، مع تصميم نحيف يناسب جميع المساحات.",
    availability: "in-stock",
    brand: "ASUS",
    category: "electronics",
    colors: ["#DB4444", "#007bff"],
    sizes: ["32 بوصة", "40 بوصة", "50 بوصة", "65 بوصة"],
    features: [
      "دقة عالية للصورة",
      "تقنية IPS لزوايا رؤية واسعة",
      "تصميم أنيق وحديث"
    ],
    specs: [
      { label: "الدقة", value: "4K UHD" },
      { label: "المنافذ", value: "HDMI, USB, AV" },
      { label: "الضمان", value: "سنتان" }
    ],
    returnPolicy: "يمكنك إرجاع المنتج خلال 14 يومًا من تاريخ الاستلام في حال وجود عيب صناعي أو عدم مطابقة المواصفات."
  },
  {
    id: "2",
    name: "حقيبة Gucci",
    price: 960,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png",
      "https://cdn-images.farfetch-contents.com/18/20/41/60/18204160_39396413_1000.jpg",
      "https://www.gucci.com/images/cms/2022/gucci-bags-hero.jpg"
    ],
    rating: 4.8,
    reviews: 256,
    description: "حقيبة يد فاخرة من الجلد الطبيعي بتصميم عصري وسعة كبيرة، مثالية للاستخدام اليومي والمناسبات.",
    details: "مصنوعة من أجود أنواع الجلد الطبيعي مع لمسات نهائية دقيقة، وتحتوي على جيوب داخلية متعددة لتسهيل تنظيم الأغراض.",
    availability: "in-stock",
    brand: "Gucci",
    category: "bags",
    colors: ["#DB4444", "#000"],
    sizes: ["صغير", "متوسط", "كبير"],
    features: [
      "جلد طبيعي 100%",
      "تصميم عصري",
      "سعة كبيرة"
    ],
    specs: [
      { label: "الخامة", value: "جلد طبيعي" },
      { label: "الأبعاد", value: "30x20x10 سم" },
      { label: "الضمان", value: "سنة" }
    ],
    returnPolicy: "يمكنك إرجاع المنتج خلال 7 أيام من تاريخ الاستلام بشرط عدم الاستخدام."
  },
  {
    id: "3",
    name: "ذراع ألعاب GP11 Shooter",
    price: 550,
    oldPrice: 700,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/aoc77xzc_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/aoc77xzc_expires_30_days.png",
      "https://m.media-amazon.com/images/I/61Qe0euJJZL._AC_SL1500_.jpg",
      "https://cdn.thewirecutter.com/wp-content/media/2022/11/gamecontrollers-2048px-03233.jpg"
    ],
    rating: 4.2,
    reviews: 89,
    description: "ذراع تحكم احترافي للألعاب مع اهتزاز مزدوج وسلك بطول 2 متر، متوافق مع الكمبيوتر والبلايستيشن.",
    details: "يمنحك تجربة ألعاب واقعية بفضل الاهتزاز المزدوج والتصميم المريح، مع توافق كامل مع معظم الأجهزة.",
    availability: "pre-order",
    brand: "HAVIT",
    category: "games",
    colors: ["#DB4444", "#007bff"],
    sizes: ["قياسي"],
    features: [
      "اهتزاز مزدوج للمزيد من الواقعية",
      "سلك بطول 2 متر",
      "متوافق مع الكمبيوتر والبلايستيشن",
      "تصميم مريح وخفيف الوزن"
    ],
    specs: [
      { label: "النوع", value: "سلكي" },
      { label: "الطول", value: "2 متر" },
      { label: "الضمان", value: "سنة" }
    ],
    returnPolicy: "يمكنك إرجاع المنتج خلال 14 يومًا من تاريخ الاستلام في حال وجود عيب صناعي."
  },
  {
    id: "4",
    name: "جاكيت ساتان مبطن",
    price: 750,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/w21oxegn_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/w21oxegn_expires_30_days.png",
      "https://cdn-images.farfetch-contents.com/17/98/13/60/17981360_39396413_1000.jpg",
      "https://www.nike.com/eg/launch/t/air-jordan-jacket"
    ],
    rating: 4.6,
    reviews: 167,
    description: "جاكيت شتوي أنيق مع بطانة دافئة ومقاوم للماء، مثالي للأيام الباردة.",
    details: "مصنوع من خامات عالية الجودة مع بطانة داخلية تمنحك الدفء والراحة طوال اليوم.",
    availability: "out-of-stock",
    brand: "Nike",
    category: "clothes",
    colors: ["#25D366", "#000"],
    sizes: ["S", "M", "L", "XL"],
    features: [
      "بطانة دافئة",
      "مقاوم للماء",
      "تصميم عصري"
    ],
    specs: [
      { label: "الخامة", value: "ساتان مبطن" },
      { label: "المقاسات", value: "S-XL" },
      { label: "الضمان", value: "6 شهور" }
    ],
    returnPolicy: "يمكنك إرجاع المنتج خلال 7 أيام من تاريخ الاستلام بشرط عدم الاستخدام."
  },
  {
    id: "5",
    name: "ساعة يد ذكية",
    price: 1200,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/clock1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/clock1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/71pWzhdGHPL._AC_SL1500_.jpg",
      "https://cdn.thewirecutter.com/wp-content/media/2022/11/smartwatches-2048px-03233.jpg"
    ],
    rating: 4.7,
    reviews: 210,
    description: "ساعة ذكية مقاومة للماء مع تتبع اللياقة، شاشة ملونة وإشعارات ذكية.",
    details: "تدعم تتبع الخطوات، مراقبة معدل ضربات القلب، إشعارات الهاتف، وبطارية تدوم حتى 7 أيام.",
    availability: "in-stock",
    brand: "Xiaomi",
    category: "watches",
    colors: ["#000", "#20c997"],
    sizes: ["قياسي"],
    features: ["مقاومة للماء", "تتبع اللياقة", "بطارية تدوم طويلاً"],
    specs: [
      { label: "البطارية", value: "7 أيام" },
      { label: "الاتصال", value: "Bluetooth" }
    ],
    returnPolicy: "إرجاع خلال 14 يومًا."
  },
  {
    id: "6",
    name: "كتاب تطوير الذات",
    price: 80,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/book1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/book1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg",
      "https://www.jarir.com/media/catalog/product/1/2/1234567890.jpg"
    ],
    rating: 4.9,
    reviews: 98,
    description: "كتاب ملهم لتطوير الذات وتحقيق النجاح، مناسب لجميع الأعمار.",
    details: "يحتوي على نصائح عملية وتمارين لتطوير الذات وتحقيق الأهداف الشخصية والمهنية.",
    availability: "in-stock",
    brand: "دار المعرفة",
    category: "books",
    colors: ["#fff", "#DB4444"],
    sizes: ["ورقي"],
    features: ["لغة عربية", "طبعة فاخرة"],
    specs: [
      { label: "عدد الصفحات", value: "220" },
      { label: "اللغة", value: "العربية" }
    ],
    returnPolicy: "إرجاع خلال 3 أيام."
  },
  {
    id: "7",
    name: "سماعات بلوتوث",
    price: 350,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/headphones1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/headphones1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg",
      "https://cdn.thewirecutter.com/wp-content/media/2022/11/headphones-2048px-03233.jpg"
    ],
    rating: 4.3,
    reviews: 150,
    description: "سماعات لاسلكية بصوت نقي وميكروفون مدمج، تدعم عزل الضوضاء.",
    details: "بطارية تدوم حتى 10 ساعات، تصميم مريح وخفيف الوزن، متوافقة مع جميع الأجهزة الذكية.",
    availability: "in-stock",
    brand: "Sony",
    category: "electronics",
    colors: ["#000", "#fff"],
    sizes: ["قياسي"],
    features: ["صوت عالي الجودة", "ميكروفون مدمج"],
    specs: [
      { label: "مدة التشغيل", value: "10 ساعات" },
      { label: "الاتصال", value: "Bluetooth" }
    ],
    returnPolicy: "إرجاع خلال 7 أيام."
  },
  {
    id: "8",
    name: "حذاء رياضي رجالي",
    price: 600,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/shoes1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/shoes1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/71k6yQ+QkGL._AC_UL1500_.jpg",
      "https://cdn-images.farfetch-contents.com/16/99/99/99/16999999_39396413_1000.jpg"
    ],
    rating: 4.4,
    reviews: 77,
    description: "حذاء رياضي مريح للتمارين والجري، تصميم عصري وخفيف الوزن.",
    details: "يوفر دعمًا ممتازًا للقدم وتهوية مثالية أثناء الحركة، مناسب للرياضة والاستخدام اليومي.",
    availability: "in-stock",
    brand: "Adidas",
    category: "shoes",
    colors: ["#000", "#fff", "#25D366"],
    sizes: ["41", "42", "43", "44"],
    features: ["راحة فائقة", "تصميم عصري"],
    specs: [
      { label: "المقاسات", value: "41-44" },
      { label: "الخامة", value: "جلد صناعي" }
    ],
    returnPolicy: "إرجاع خلال 14 يومًا."
  },
  {
    id: "9",
    name: "مكواة بخار منزلية",
    price: 300,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/iron1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/iron1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/61w0pVITQwL._AC_SL1500_.jpg",
      "https://cdn.thewirecutter.com/wp-content/media/2022/11/irons-2048px-03233.jpg"
    ],
    rating: 4.1,
    reviews: 34,
    description: "مكواة بخار قوية وسهلة الاستخدام مع خزان ماء كبير.",
    details: "تسخين سريع وبخار قوي لإزالة التجاعيد بسرعة، تصميم مريح وخفيف الوزن.",
    availability: "in-stock",
    brand: "Philips",
    category: "home",
    colors: ["#007bff", "#DB4444"],
    sizes: ["قياسي"],
    features: ["بخار قوي", "خزان ماء كبير"],
    specs: [
      { label: "القوة", value: "2200 واط" },
      { label: "الخزان", value: "350 مل" }
    ],
    returnPolicy: "إرجاع خلال 7 أيام."
  },
  {
    id: "10",
    name: "نظارة شمسية عصرية",
    price: 250,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/glasses1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/glasses1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/61p1QwQkGGL._AC_UL1500_.jpg",
      "https://cdn-images.farfetch-contents.com/17/98/13/60/17981360_39396413_1000.jpg"
    ],
    rating: 4.6,
    reviews: 60,
    description: "نظارة شمسية حماية UV وتصميم أنيق، عدسات عالية الجودة.",
    details: "توفر حماية كاملة من الأشعة فوق البنفسجية مع تصميم عصري يناسب جميع الأذواق.",
    availability: "in-stock",
    brand: "Ray-Ban",
    category: "accessories",
    colors: ["#000", "#e83e8c"],
    sizes: ["قياسي"],
    features: ["حماية من الأشعة فوق البنفسجية", "تصميم عصري"],
    specs: [
      { label: "العدسات", value: "UV400" },
      { label: "الخامة", value: "بلاستيك عالي الجودة" }
    ],
    returnPolicy: "إرجاع خلال 5 أيام."
  }
];

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<i key={i} className="fas fa-star-half-alt text-warning"></i>);
    } else {
      stars.push(<i key={i} className="far fa-star text-warning"></i>);
    }
  }

  return <div className="d-flex gap-1">{stars}</div>;
};

const AvailabilityBadge = ({ status }) => {
  const statusConfig = {
    "in-stock": { label: "متوفر", className: "bg-success" },
    "out-of-stock": { label: "غير متوفر", className: "bg-danger" },
    "pre-order": { label: "طلب مسبق", className: "bg-warning text-dark" }
  };

  const config = statusConfig[status] || statusConfig["in-stock"];

  return (
    <span className={`badge ${config.className} position-absolute`} style={{ top: 10, right: 10 }}>
      {config.label}
    </span>
  );
};

export default function ShopProducts() {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="row g-4">
      {products.map(item => (
        <div
          className="col-12 col-md-6 col-lg-4 col-xl-3"
          key={item.id}
          data-aos="fade-up"
        >
          <div
            className={`product-card-pro h-100 position-relative bg-white rounded p-3 d-flex flex-column ${hoveredProduct === item.id ? 'active' : ''}`}
            tabIndex={0}
            role="button"
            onClick={() => navigate(`/product/${item.id}`)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/product/${item.id}`)}
            onMouseEnter={() => setHoveredProduct(item.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            style={{
              boxShadow: hoveredProduct === item.id ? "0 8px 32px rgba(219,68,68,0.18)" : "0 2px 8px rgba(0,0,0,0.08)",
              border: hoveredProduct === item.id ? "1.5px solid #DB4444" : "1px solid #eee",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
              minHeight: 420,
              direction: "rtl"
            }}
          >
            <div className="product-img-wrapper mb-2 position-relative w-100 d-flex justify-content-center align-items-center" style={{height: 180, overflow: 'hidden'}}>
              <img
                src={item.image}
                alt={item.name}
                className="product-img-main"
                style={{height: 170, objectFit: 'contain', borderRadius: 12, background: '#f6f6f6', width: '100%', transition: 'transform 0.3s'}}
                onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
              />
              {item.oldPrice && (
                <span className="badge bg-danger position-absolute" style={{top: 10, left: 10}}>
                  {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% خصم
                </span>
              )}
            </div>
            <div className="flex-grow-1 d-flex flex-column align-items-center">
              <span className="text-muted small">{item.brand}</span>
              <h6 className="fw-bold text-center mb-1" style={{minHeight: 32}}>{item.name}</h6>
              <div className="mb-1"><StarRating rating={item.rating} /></div>
              <div className="mb-2">
                <span className="text-danger fw-bold">{item.price} ج.م</span>
                {item.oldPrice && <span className="text-muted text-decoration-line-through ms-2">{item.oldPrice} ج.م</span>}
              </div>
              <div className="d-flex gap-1 mb-2">
                {item.colors.map((color, idx) => (
                  <span key={idx} style={{width: 16, height: 16, borderRadius: '50%', background: color, border: '1px solid #eee', display: 'inline-block'}}></span>
                ))}
              </div>
              <div className="d-flex gap-1 mb-2 flex-wrap">
                {item.sizes.filter(s => s !== 'قياسي' && s !== 'ورقي').map((size, idx) => (
                  <span key={idx} className="badge bg-light text-dark border" style={{fontSize: '0.85em', margin: 1}}>{size}</span>
                ))}
              </div>
              <div className={`product-actions mt-auto gap-2 ${hoveredProduct === item.id ? 'show' : ''}`} style={{display: 'flex', opacity: hoveredProduct === item.id ? 1 : 0, pointerEvents: hoveredProduct === item.id ? 'auto' : 'none', transition: 'opacity 0.2s'}}>
                <button className="btn btn-sm btn-danger"><i className="fas fa-shopping-cart"></i></button>
                <button className="btn btn-sm btn-outline-danger"><i className="fas fa-heart"></i></button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <style jsx>{`
        .product-card-pro {
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-radius: 18px;
          border: 1px solid #eee;
          background: #fff;
          min-height: 420px;
          position: relative;
        }
        .product-card-pro.active, .product-card-pro:active, .product-card-pro:focus {
          box-shadow: 0 8px 32px rgba(219,68,68,0.18) !important;
          border: 1.5px solid #DB4444 !important;
        }
        .product-card-pro .product-img-main {
          transition: transform 0.3s;
        }
        .product-card-pro.active .product-img-main,
        .product-card-pro:hover .product-img-main {
          transform: scale(1.08) rotate(-2deg);
        }
        .product-actions {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .product-card-pro.active .product-actions,
        .product-card-pro:hover .product-actions {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
} 