import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";
import "./App.css";
import AnaSayfa from "./AnaSayfa";
import Sorularim from "./Sorularim";
import HeaderContainer from "./HeaderContainer";

function App() {
	const [username, setUsername] = useState("");

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home setUsername={setUsername} />} />
				<Route
					path="/anasayfa"
					element={
						<>
							<HeaderContainer username={username} />{" "}
							{/* Kullanıcı adı prop olarak geçilecek */}
							<AnaSayfa kullaniciAdi={username} />
						</>
					}
				/>
				<Route
					path="/sorularim"
					element={
						<>
							<HeaderContainer username={username} />{" "}
							{/* Kullanıcı adı prop olarak geçilecek */}
							<Sorularim />
						</>
					}
				/>
			</Routes>
		</Router>
	);
}

function Home({ setUsername }) {
	const navigate = useNavigate();
	const [kullaniciAdi, setKullaniciAdi] = useState("");
	const [sifre, setSifre] = useState("");
	const [error, setError] = useState("");

	const handleLogin = async () => {
		try {
			const response = await fetch("http://localhost:5000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ kullaniciAdi, sifre }),
			});
			const data = await response.json();
			if (response.ok) {
				setError("");
				setUsername(kullaniciAdi);
				navigate("/anasayfa");
			} else {
				setError(data.message);
			}
		} catch (error) {
			console.error("Giriş yapma hatası:", error);
			setError("Bir hata oluştu. Lütfen tekrar deneyin.");
		}
	};

	const handleRegister = async () => {
		try {
			const response = await fetch("http://localhost:5000/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ kullaniciAdi, sifre }),
			});
			const data = await response.json();
			if (response.ok) {
				setError("");
				alert("Kayıt başarılı. Giriş yapabilirsiniz.");
			} else {
				setError(data.message);
			}
		} catch (error) {
			console.error("Kayıt olma hatası:", error);
			setError("Bir hata oluştu. Lütfen tekrar deneyin.");
		}
	};

	return (
		<section className="container">
			<div className="image-section">
				<div className="image-wrapper">
					<img src="./mesh-gradient.png" alt="Mesh Gradient" />
				</div>

				<div className="content-container">
					<h1 className="section-heading">
						Dijital Dünyanızı <span>Eğitin.</span>
					</h1>
					<p className="section-paragraph">
						Sorular sorarak diğerlerinden yeni bilgiler öğrenin
					</p>
				</div>
			</div>
			<div className="form-section">
				<div className="form-wrapper">
					<div className="logo-container">
						<a href="#" className="logo-container">
							<img src="./nibgat_logo.png" alt="logo" />
						</a>
					</div>

					<h2>Tekrar Hoşgeldiniz!</h2>
					<p>
						Bilgilerinizi girerek hesabınıza giriş yapın veya yeni kayıt
						oluşturun.
					</p>
					<div className="input-container">
						<div className="form-group">
							<label htmlFor="email">Kullanıcı Adı</label>
							<input
								id="email"
								autoComplete="off"
								value={kullaniciAdi}
								onChange={(e) => setKullaniciAdi(e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password">Şifre</label>
							<input
								type="password"
								id="password"
								value={sifre}
								onChange={(e) => setSifre(e.target.value)}
							/>
						</div>
					</div>

					{error && <p className="error-message">{error}</p>}

					<button className="login-btn" onClick={handleLogin}>
						Giriş Yap
					</button>
					<button className="login-btn" onClick={handleRegister}>
						Kayıt Oluştur
					</button>
				</div>
			</div>
		</section>
	);
}

export default App;
