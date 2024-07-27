import React, { useState, useEffect } from "react";
import "./Sorularim.css";

function Sorularim() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [notes, setNotes] = useState([]);
	const [filteredNotes, setFilteredNotes] = useState([]);
	const [error, setError] = useState("");
	const [isEditing, setIsEditing] = useState(null);
	const [editForm, setEditForm] = useState({
		id: "",
		notBasligi: "",
		notAciklamasi: "",
		kategori: "",
		tarih: "",
	});

	const fetchNotes = async (username) => {
		try {
			const response = await fetch(
				`http://localhost:5000/user-notes?kullaniciAdi=${username}`
			);
			if (!response.ok) {
				throw new Error(`HTTP hatası! Status: ${response.status}`);
			}
			const data = await response.json();
			setNotes(data);
			setFilteredNotes(data);
		} catch (error) {
			setError("Veri çekme sırasında bir hata oluştu: " + error.message);
		}
	};

	const handleLogin = async () => {
		setNotes([]);
		setFilteredNotes([]);
		setError("");

		try {
			const response = await fetch("http://localhost:5000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ kullaniciAdi: username, sifre: password }),
			});
			const data = await response.json();
			if (response.ok) {
				fetchNotes(username);
			} else {
				setError(data.message);
			}
		} catch (error) {
			setError("Giriş sırasında bir hata oluştu: " + error.message);
		}
	};

	const handleEditChange = (e) => {
		setEditForm({
			...editForm,
			[e.target.name]: e.target.value,
		});
	};

	const handleEdit = (note) => {
		let formattedDate = "";

		// Tarih değerini kontrol et ve uygun formatta olup olmadığını doğrula
		if (note.tarih && !isNaN(new Date(note.tarih).getTime())) {
			formattedDate = new Date(note.tarih).toISOString().split("T")[0];
		} else {
			formattedDate = ""; // Geçerli değilse boş bir değer ayarla
		}

		setEditForm({
			id: note.id,
			notBasligi: note.notBasligi,
			notAciklamasi: note.notAciklamasi,
			kategori: note.kategori,
			tarih: formattedDate,
		});
		setIsEditing(note.id);
	};

	const handleSaveEdit = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/notes/${editForm.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...editForm,
						kullaniciAdi: username,
						sifre: password,
					}),
				}
			);
			const data = await response.json();
			if (response.ok) {
				setIsEditing(null);
				fetchNotes(username);
			} else {
				setError(data.message);
			}
		} catch (error) {
			setError("Düzenleme sırasında bir hata oluştu: " + error.message);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await fetch(`http://localhost:5000/notes/${id}`, {
				method: "DELETE",
			});
			const data = await response.json();
			if (response.ok) {
				fetchNotes(username);
			} else {
				setError(data.message);
			}
		} catch (error) {
			setError("Silme sırasında bir hata oluştu: " + error.message);
		}
	};

	return (
		<div className="sorularim-container">
			<p>
				Kullanıcı adı ve şifrenizi girerek yayınladığınız soruları
				görebilirsiniz.
			</p>
			<div className="login-form">
				<div className="form-group">
					<input
						type="text"
						id="username"
						placeholder="Kullanıcı Adı"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						id="password"
						placeholder="Şifre"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button onClick={handleLogin}>Sorularımı Gör</button>
				{error && <p className="error-message">{error}</p>}
			</div>

			{filteredNotes.length === 0 && username && (
				<p>Henüz soru yayınlamadınız.</p>
			)}

			{filteredNotes.length > 0 && (
				<div className="questions-list">
					{filteredNotes.map((note) => (
						<div className="question-container" key={note.id}>
							{isEditing === note.id ? (
								<div>
									<div className="form-group">
										<label htmlFor="editTitle">Soru Başlığı:</label>
										<input
											type="text"
											id="editTitle"
											name="notBasligi"
											value={editForm.notBasligi}
											onChange={handleEditChange}
										/>
									</div>
									<div className="form-group">
										<label htmlFor="editDescription">Soru Açıklaması:</label>
										<textarea
											id="editDescription"
											name="notAciklamasi"
											value={editForm.notAciklamasi}
											onChange={handleEditChange}
										/>
									</div>
									<div className="form-group">
										<label htmlFor="editCategory">Kategori:</label>
										<select
											id="editCategory"
											name="kategori"
											value={editForm.kategori}
											onChange={handleEditChange}
										>
											<option value="Teknoloji">Teknoloji</option>
											<option value="Spor">Spor</option>
										</select>
									</div>
									<div className="form-group">
										<label htmlFor="editDate">Tarih:</label>
										<input
											type="date"
											id="editDate"
											name="tarih"
											value={editForm.tarih}
											onChange={handleEditChange}
										/>
									</div>
									<div className="form-group">
										<label>Kullanıcı Adı:</label>
										<p>{username}</p>
									</div>
									<div className="form-group">
										<label>Görüntüleme Sayısı:</label>
										<p>{note.goruntulemeSayisi}</p>
									</div>
									<div className="form-actions">
										<button onClick={handleSaveEdit}>Kaydet</button>
										<button onClick={() => setIsEditing(null)}>İptal</button>
									</div>
								</div>
							) : (
								<>
									<h2>{note.notBasligi}</h2>
									<p>{note.notAciklamasi}</p>
									<div className="details">
										<span>{new Date(note.tarih).toLocaleDateString()}</span>
										<span>Kategori: {note.kategori}</span>
										<span>Kullanıcı Adı: {note.kullaniciAdi}</span>
										<span>Görüntüleme Sayısı: {note.goruntulemeSayisi}</span>
									</div>
									<div className="form-actions">
										<button onClick={() => handleEdit(note)}>Düzenle</button>
										<button onClick={() => handleDelete(note.id)}>Sil</button>
									</div>
								</>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Sorularim;
