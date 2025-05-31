import React from 'react'
import FlashSales from '../components/Home/FlashSales'
import Categories from '../components/Home/Categories'
import Products from '../components/Home/Products'
const products = [
    {
        name: 'لوحة ألعاب HAVIT HV-G92',
        price: '١٢٠ ج.م',
        oldPrice: '١٦٠ ج.م',
        discount: '٤٠٪ خصم',
        rating: 5,
        reviews: 88,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
    {
        name: 'لوحة مفاتيح AK-900 سلكية',
        price: '٩٦٠ ج.م',
        oldPrice: '١١٦٠ ج.م',
        discount: '٣٥٪ خصم',
        rating: 4,
        reviews: 75,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
    {
        name: 'شاشة ألعاب IPS LCD',
        price: '٣٧٠ ج.م',
        oldPrice: '٤٠٠ ج.م',
        discount: '٣٠٪ خصم',
        rating: 5,
        reviews: 99,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
    {
        name: 'كرسي مريح من سلسلة S',
        price: '٣٧٥ ج.م',
        oldPrice: '٤٠٠ ج.م',
        discount: '٢٥٪ خصم',
        rating: 4.5,
        reviews: 99,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
    {
        name: 'سماعات رأس لاسلكية',
        price: '٢٥٠ ج.م',
        oldPrice: '٣٠٠ ج.م',
        discount: '١٧٪ خصم',
        rating: 4,
        reviews: 60,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/w21oxegn_expires_30_days.png  ',
    },
    {
        name: 'ماوس ألعاب احترافي',
        price: '١٨٠ ج.م',
        oldPrice: '٢٢٠ ج.م',
        discount: '١٨٪ خصم',
        rating: 4.5,
        reviews: 45,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/w21oxegn_expires_30_days.png  ',
    },
    {
        name: 'ساعة ذكية',
        price: '٥٥٠ ج.م',
        oldPrice: '٦٠٠ ج.م',
        discount: '٨٪ خصم',
        rating: 4,
        reviews: 80,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/w21oxegn_expires_30_days.png  ',
    },
    {
        name: 'هاتف ذكي',
        price: '٣٠٠٠ ج.م',
        oldPrice: '٣٥٠٠ ج.م',
        discount: '١٤٪ خصم',
        rating: 5,
        reviews: 120,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/w21oxegn_expires_30_days.png  ',
    },
    {
        name: 'جهاز لوحي',
        price: '١٥٠٠ ج.م',
        oldPrice: '١٧٠٠ ج.م',
        discount: '١٢٪ خصم',
        rating: 4,
        reviews: 70,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/h9xc0rsa_expires_30_days.png  ',
    },
    {
        name: 'كاميرا رقمية',
        price: '٢٢٠٠ ج.م',
        oldPrice: '٢٥٠٠ ج.م',
        discount: '١٢٪ خصم',
        rating: 4.5,
        reviews: 55,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/h9xc0rsa_expires_30_days.png  ',
    },
    {
        name: 'مكبر صوت بلوتوث',
        price: '٣٠٠ ج.م',
        oldPrice: '٣٥٠ ج.م',
        discount: '١٤٪ خصم',
        rating: 4,
        reviews: 40,
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/h9xc0rsa_expires_30_days.png  ',
    }

];
function Home() {
    
    
    return (
        <>
            <div>home</div>
            <FlashSales products={products} />
            <Categories />
            <Products products={products} />
        </>
    )
}

export default Home