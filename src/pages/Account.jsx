import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Account() {
	// الملف الشخصي
	const [input1, setInput1] = useState("");
	const [input2, setInput2] = useState("");
	const [input3, setInput3] = useState("");
	const [input4, setInput4] = useState("");
	const [input5, setInput5] = useState("");
	const [input6, setInput6] = useState("");
	const [input7, setInput7] = useState("");
	const [activeSection, setActiveSection] = useState("profile");

	// دفتر العناوين
	const [addresses, setAddresses] = useState([
		{ id: 1, name: "المنزل", city: "القاهرة", details: "شارع التحرير، عمارة 10" },
		{ id: 2, name: "العمل", city: "الجيزة", details: "شارع جامعة الدول" },
	]);
	const [newAddress, setNewAddress] = useState({ name: "", city: "", details: "" });
	const [editId, setEditId] = useState(null);

	// خيارات الدفع
	const [payments, setPayments] = useState([
		{ id: 1, type: "بطاقة ائتمان", number: "**** **** **** 1234", holder: "محمد أحمد" },
		{ id: 2, type: "بطاقة خصم", number: "**** **** **** 5678", holder: "محمد أحمد" },
	]);
	const [newPayment, setNewPayment] = useState({ type: "بطاقة ائتمان", number: "", holder: "" });
	const [paymentTab, setPaymentTab] = useState("card");
	const [instapayNumber] = useState("01012345678"); // رقم Instapay
	const [instapayImage, setInstapayImage] = useState(null);
	const [instapayStatus, setInstapayStatus] = useState("");

	// المرتجعات والإلغاءات
	const [returns, setReturns] = useState([
		{ id: 1, order: "#1001", status: "قيد المعالجة", type: "مرتجع" },
		{ id: 2, order: "#1002", status: "تم الإلغاء", type: "إلغاء" },
	]);

	// المفضلة
	const [wishlist, setWishlist] = useState([
		{ id: 1, name: "ساعة ذكية", price: 1200, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png" },
		{ id: 2, name: "سماعات بلوتوث", price: 350, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/aoc77xzc_expires_30_days.png" },
	]);

	// دوال دفتر العناوين
	const handleAddAddress = (e) => {
		e.preventDefault();
		if (!newAddress.name || !newAddress.city || !newAddress.details) return;
		setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
		setNewAddress({ name: "", city: "", details: "" });
	};
	const handleDeleteAddress = (id) => setAddresses(addresses.filter(a => a.id !== id));
	const handleEditAddress = (address) => {
		setEditId(address.id);
		setNewAddress({ name: address.name, city: address.city, details: address.details });
	};
	const handleUpdateAddress = (e) => {
		e.preventDefault();
		setAddresses(addresses.map(a => a.id === editId ? { ...a, ...newAddress } : a));
		setEditId(null);
		setNewAddress({ name: "", city: "", details: "" });
	};

	// دوال الدفع
	const handleAddPayment = (e) => {
		e.preventDefault();
		if (!newPayment.number || !newPayment.holder) return;
		setPayments([...payments, { ...newPayment, id: Date.now() }]);
		setNewPayment({ type: "بطاقة ائتمان", number: "", holder: "" });
	};
	const handleDeletePayment = (id) => setPayments(payments.filter(p => p.id !== id));

	// Instapay
	const handleInstapayImage = (e) => {
		if (e.target.files && e.target.files[0]) {
			setInstapayImage(e.target.files[0]);
			setInstapayStatus("بانتظار تأكيد الإدارة...");
		}
	};

	// دوال المفضلة
	const handleRemoveWishlist = (id) => setWishlist(wishlist.filter(w => w.id !== id));
	const handleAddToCart = (id) => alert("تمت إضافة المنتج إلى السلة!");

	// محتوى كل قسم
	const renderSection = () => {
		switch (activeSection) {
			case "profile":
				return (
					<div className="card shadow-sm border-0">
						<div className="card-body">
							<h4 className="fw-bold text-danger mb-4">تعديل الملف الشخصي</h4>
							<form>
								<div className="row mb-3">
									<div className="col-md-6 mb-3 mb-md-0">
										<label className="form-label">الاسم الأول</label>
										<input type="text" className="form-control" placeholder="محمد" value={input1} onChange={e => setInput1(e.target.value)} />
									</div>
									<div className="col-md-6">
										<label className="form-label">الاسم الأخير</label>
										<input type="text" className="form-control" placeholder="أحمد" value={input2} onChange={e => setInput2(e.target.value)} />
									</div>
								</div>
								<div className="row mb-3">
									<div className="col-md-6 mb-3 mb-md-0">
										<label className="form-label">البريد الإلكتروني</label>
										<input type="email" className="form-control" placeholder="example@gmail.com" value={input3} onChange={e => setInput3(e.target.value)} />
									</div>
									<div className="col-md-6">
										<label className="form-label">العنوان</label>
										<input type="text" className="form-control" placeholder="القاهرة، مصر" value={input4} onChange={e => setInput4(e.target.value)} />
									</div>
								</div>
								<div className="mb-3">
									<label className="form-label">تغيير كلمة المرور</label>
									<input type="password" className="form-control mb-2" placeholder="كلمة المرور الحالية" value={input5} onChange={e => setInput5(e.target.value)} />
									<input type="password" className="form-control mb-2" placeholder="كلمة المرور الجديدة" value={input6} onChange={e => setInput6(e.target.value)} />
									<input type="password" className="form-control" placeholder="تأكيد كلمة المرور الجديدة" value={input7} onChange={e => setInput7(e.target.value)} />
								</div>
								<div className="d-flex justify-content-end gap-3 mt-4">
									<button type="button" className="btn btn-outline-secondary">إلغاء</button>
									<button type="submit" className="btn btn-danger fw-bold">حفظ التغييرات</button>
								</div>
							</form>
						</div>
					</div>
				);
			case "address":
				return (
					<div className="card shadow-sm border-0">
						<div className="card-body">
							<h4 className="fw-bold text-primary mb-4">دفتر العناوين</h4>
							<ul className="list-group mb-4">
								{addresses.map(addr => (
									<li key={addr.id} className="list-group-item d-flex justify-content-between align-items-center">
										<div>
											<div className="fw-bold">{addr.name} - {addr.city}</div>
											<div className="text-muted small">{addr.details}</div>
										</div>
										<div>
											<button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditAddress(addr)}>تعديل</button>
											<button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAddress(addr.id)}>حذف</button>
										</div>
									</li>
								))}
							</ul>
							<form onSubmit={editId ? handleUpdateAddress : handleAddAddress} className="row g-2 align-items-end">
								<div className="col-md-3">
									<label className="form-label">اسم العنوان</label>
									<input className="form-control" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} placeholder="مثال: المنزل" />
								</div>
								<div className="col-md-3">
									<label className="form-label">المدينة</label>
									<input className="form-control" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="مثال: القاهرة" />
								</div>
								<div className="col-md-4">
									<label className="form-label">تفاصيل العنوان</label>
									<input className="form-control" value={newAddress.details} onChange={e => setNewAddress({ ...newAddress, details: e.target.value })} placeholder="مثال: شارع التحرير" />
								</div>
								<div className="col-md-2">
									<button className="btn btn-success w-100" type="submit">{editId ? "تحديث" : "إضافة"}</button>
								</div>
							</form>
						</div>
					</div>
				);
			case "payment":
				return (
					<div className="card shadow-sm border-0">
						<div className="card-body">
							<h4 className="fw-bold text-primary mb-4">خيارات الدفع</h4>
							<ul className="nav nav-tabs mb-4">
								<li className="nav-item">
									<button className={`nav-link${paymentTab === "card" ? " active" : ""}`} onClick={() => setPaymentTab("card")}>بطاقة فيزا/ماستر كارد</button>
								</li>
								<li className="nav-item">
									<button className={`nav-link${paymentTab === "instapay" ? " active" : ""}`} onClick={() => setPaymentTab("instapay")}>الدفع عبر Instapay</button>
								</li>
							</ul>
							{paymentTab === "card" && (
								<>
									<ul className="list-group mb-4">
										{payments.map(pay => (
											<li key={pay.id} className="list-group-item d-flex justify-content-between align-items-center">
												<div>
													<div className="fw-bold">{pay.type}</div>
													<div className="text-muted small">{pay.number} - {pay.holder}</div>
												</div>
												<button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePayment(pay.id)}>حذف</button>
											</li>
										))}
									</ul>
									<form onSubmit={handleAddPayment} className="row g-2 align-items-end">
										<div className="col-md-3">
											<label className="form-label">نوع البطاقة</label>
											<select className="form-select" value={newPayment.type} onChange={e => setNewPayment({ ...newPayment, type: e.target.value })}>
												<option>بطاقة ائتمان</option>
												<option>بطاقة خصم</option>
											</select>
										</div>
										<div className="col-md-4">
											<label className="form-label">رقم البطاقة</label>
											<input className="form-control" value={newPayment.number} onChange={e => setNewPayment({ ...newPayment, number: e.target.value })} placeholder="**** **** **** 1234" />
										</div>
										<div className="col-md-3">
											<label className="form-label">اسم حامل البطاقة</label>
											<input className="form-control" value={newPayment.holder} onChange={e => setNewPayment({ ...newPayment, holder: e.target.value })} placeholder="محمد أحمد" />
										</div>
										<div className="col-md-2">
											<button className="btn btn-success w-100" type="submit">إضافة</button>
										</div>
									</form>
								</>
							)}
							{paymentTab === "instapay" && (
								<div className="border rounded p-4 bg-light">
									<h5 className="fw-bold mb-3">الدفع عبر Instapay</h5>
									<div className="mb-2">رقم Instapay لتحويل المبلغ:</div>
									<div className="alert alert-info fw-bold mb-3" dir="ltr" style={{direction:'ltr',textAlign:'left'}}>{instapayNumber}</div>
									<div className="mb-3">يرجى تحويل المبلغ إلى رقم Instapay أعلاه من خلال تطبيق Instapay على هاتفك، ثم رفع صورة (Screenshot) لإثبات التحويل.</div>
									<input type="file" accept="image/*" className="form-control mb-2" onChange={handleInstapayImage} />
									{instapayImage && (
										<div className="mb-2">
											<span className="text-success">تم رفع الصورة بنجاح!</span>
											<div className="mt-2"><img src={URL.createObjectURL(instapayImage)} alt="إثبات التحويل" style={{maxWidth:200, borderRadius:8}} /></div>
										</div>
									)}
									{instapayStatus && <div className="alert alert-warning mt-3">{instapayStatus}</div>}
								</div>
							)}
						</div>
					</div>
				);
			case "returns":
			case "cancellations":
				return (
					<div className="card shadow-sm border-0">
						<div className="card-body">
							<h4 className="fw-bold text-primary mb-4">{activeSection === "returns" ? "المرتجعات" : "الإلغاءات"}</h4>
							<table className="table table-bordered text-center">
								<thead className="table-light">
									<tr>
										<th>رقم الطلب</th>
										<th>النوع</th>
										<th>الحالة</th>
									</tr>
								</thead>
								<tbody>
									{returns.filter(r => activeSection === "returns" ? r.type === "مرتجع" : r.type === "إلغاء").map(r => (
										<tr key={r.id}>
											<td>{r.order}</td>
											<td>{r.type}</td>
											<td>{r.status}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				);
			case "wishlist":
				return (
					<div className="card shadow-sm border-0">
						<div className="card-body">
							<h4 className="fw-bold text-primary mb-4">المفضلة</h4>
							<div className="row g-3">
								{wishlist.length === 0 && <div className="col-12 text-center">لا توجد منتجات في المفضلة</div>}
								{wishlist.map(item => (
									<div className="col-12 col-md-6 col-lg-4" key={item.id}>
										<div className="card h-100 border-0 shadow-sm">
											<img src={item.image} alt={item.name} className="card-img-top p-3" style={{height: 120, objectFit: 'contain'}} />
											<div className="card-body text-center">
												<h6 className="fw-bold mb-2">{item.name}</h6>
												<span className="text-danger fw-bold mb-2 d-block">{item.price} ج.م</span>
												<button className="btn btn-dark btn-sm w-100 mb-2" onClick={() => handleAddToCart(item.id)}>
													<i className="fas fa-shopping-cart ms-2"></i>أضف إلى السلة
												</button>
												<button className="btn btn-outline-danger btn-sm w-100" onClick={() => handleRemoveWishlist(item.id)}>
													<i className="fas fa-trash"></i> حذف
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="bg-white" dir="rtl" style={{ textAlign: "right" }}>
			<Header />
			<div className="container py-5">
				<div className="row g-4">
					{/* Sidebar */}
					<div className="col-lg-3">
						<div className="list-group mb-4 shadow-sm">
							<div className="list-group-item fw-bold bg-light">إدارة حسابي</div>
							<button className={`list-group-item list-group-item-action${activeSection === "profile" ? " text-danger active" : ""}`} onClick={() => setActiveSection("profile")}>الملف الشخصي</button>
							<button className={`list-group-item list-group-item-action${activeSection === "address" ? " active" : ""}`} onClick={() => setActiveSection("address")}>دفتر العناوين</button>
							<button className={`list-group-item list-group-item-action${activeSection === "payment" ? " active" : ""}`} onClick={() => setActiveSection("payment")}>خيارات الدفع</button>
							<div className="list-group-item fw-bold bg-light mt-3">طلباتي</div>
							<button className={`list-group-item list-group-item-action${activeSection === "returns" ? " active" : ""}`} onClick={() => setActiveSection("returns")}>المرتجعات</button>
							<button className={`list-group-item list-group-item-action${activeSection === "cancellations" ? " active" : ""}`} onClick={() => setActiveSection("cancellations")}>الإلغاءات</button>
							<div className="list-group-item fw-bold bg-light mt-3">المفضلة</div>
							<button className={`list-group-item list-group-item-action${activeSection === "wishlist" ? " active" : ""}`} onClick={() => setActiveSection("wishlist")}>المفضلة</button>
						</div>
					</div>
					{/* Main Section */}
					<div className="col-lg-9">
						{renderSection()}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
} 