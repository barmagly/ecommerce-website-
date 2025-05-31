import React from 'react';

const bestSelling = [
  {
    id: 1,
    name: 'وسيط ألعاب HAVIT HV-G92',
    image: 'https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp',
    price: 120,
    oldPrice: 160,
  },
  {
    id: 2,
    name: 'لوحة مفاتيح AK-900 سلكية',
    image: 'https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp',
    price: 100,
    oldPrice: 150,
  },
  {
    id: 3,
    name: 'شاشة ألعاب IPS LCD',
    image: 'https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp',
    price: 370,
    oldPrice: 400,
  },
  {
    id: 4,
    name: 'كرسي راحة سيريز S',
    image: 'https://www.androidheadlines.com/wp-content/uploads/2023/11/Apple-iPhone-16-Pro-Max-Technizo-Concept-image-1-jpg.webp',
    price: 375,
    oldPrice: 400,
  },
];

export default function BestSelling() {
  return (
    <div className="container py-5">
      <div className="new-arrival-header mb-4">
        <span className="featured-tag">هذا الشهر</span>
        <h2 className="new-arrival-title">الأفضل مبيعًا</h2>
      </div>
      <div className="row">
        {bestSelling.map((item) => (
          <div className="col-md-3 mb-4" key={item.id}>
            <div className="card h-100">
              <img src={item.image} className="card-img-top" alt={item.name} />
              <div className="card-body">
                <h6 className="card-title">{item.name}</h6>
                <p className="card-text">
                  <strong>${item.price}</strong> <del>${item.oldPrice}</del>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}