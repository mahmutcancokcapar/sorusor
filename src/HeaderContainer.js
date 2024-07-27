import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderContainer.css";

function HeaderContainer() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [category, setCategory] = useState("Teknoloji");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/");
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Çıkış yapma hatası:", error);
      alert("Çıkış yapma sırasında bir hata oluştu.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Temizle
    setUsername("");
    setPassword("");
    setQuestionTitle("");
    setQuestionDescription("");
    setCategory("Teknoloji");
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    try {
      const loginResponse = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kullaniciAdi: username, sifre: password }),
      });
      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setErrorMessage(loginData.message);
        return;
      }

      const noteData = {
        kullaniciAdi: username,
        notBasligi: questionTitle,
        notAciklamasi: questionDescription,
        kategori: category,
        tarih: new Date().toISOString(),
      };

      const noteResponse = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      const noteResult = await noteResponse.json();
      if (noteResponse.ok) {
        alert("Soru yayınlandı!");
        closeModal();
      } else {
        setErrorMessage(noteResult.message);
      }
    } catch (error) {
      console.error("Kayıt işlemi hatası:", error);
      setErrorMessage("Kayıt işlemi sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="header-container">
      <div className="logo-container">
        <a href="#" className="logo-container">
          <img src="./nibgat_logo.png" alt="logo" />
        </a>
      </div>
      <div className="tabs-container">
        <a href="/anasayfa">Ana Sayfa</a>
        <a href="/sorularim">Sorularım</a>
      </div>
      <div className="profil-container">
        <div className="profil-container-pp" onClick={toggleDropdown}>
          <img src="./pp.jpg" alt="Profil" />
        </div>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        )}
        <div className="profil-container-add" onClick={openModal}>
          +
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Yeni Soru Oluştur</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form>
              <div className="form-group">
                <label htmlFor="username">Kullanıcı Adı:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı girin..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Şifre:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="questionTitle">Soru Başlığı:</label>
                <input
                  type="text"
                  id="questionTitle"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="Soru başlığını girin..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="questionDescription">Soru Açıklaması:</label>
                <textarea
                  id="questionDescription"
                  value={questionDescription}
                  onChange={(e) => setQuestionDescription(e.target.value)}
                  placeholder="Soru açıklamasını girin..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="currentDate">Tarih:</label>
                <p id="currentDate">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="form-group">
                <label htmlFor="category">Kategori:</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Teknoloji">Teknoloji</option>
                  <option value="Spor">Spor</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleSubmit}>
                  Yayınla
                </button>
                <button type="button" onClick={closeModal}>
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderContainer;
