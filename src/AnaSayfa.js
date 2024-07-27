import React, { useState, useEffect } from "react";
import "./AnaSayfa.css";
import { FaSearch } from "react-icons/fa";
import HeaderContainer from "./HeaderContainer";

function AnaSayfa() {
	const [isModalOpen, setModalOpen] = useState(false);
	const [notes, setNotes] = useState([]);
	const [filteredNotes, setFilteredNotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("Tümü");
	const [selectedNote, setSelectedNote] = useState(null);

	const openModal = async (note) => {
		if (note) {
			try {
				const updatedNote = {
					...note,
					goruntulemeSayisi: note.goruntulemeSayisi + 1,
				};
				const response = await fetch(`http://localhost:5000/notes/${note.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						goruntulemeSayisi: updatedNote.goruntulemeSayisi,
					}),
				});
				if (!response.ok) {
					throw new Error(`HTTP hatası! Status: ${response.status}`);
				}
				const updatedNotes = notes.map((n) =>
					n.id === note.id ? updatedNote : n
				);
				setNotes(updatedNotes);
				setFilteredNotes(updatedNotes);
			} catch (error) {
				console.error(
					"Görüntüleme sayısı güncellenirken bir hata oluştu: ",
					error
				);
			}
		}
		setSelectedNote(note);
		setModalOpen(true);
	};

	const closeModal = () => setModalOpen(false);

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const response = await fetch("http://localhost:5000/notes");
				if (!response.ok) {
					throw new Error(`HTTP hatası! Status: ${response.status}`);
				}
				const data = await response.json();
				console.log(data);
				if (data.message) {
					setError(data.message);
				} else {
					setNotes(data);
					setFilteredNotes(data);
				}
			} catch (error) {
				setError("Veri çekme sırasında bir hata oluştu: " + error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchNotes();
	}, []);

	useEffect(() => {
		if (selectedCategory === "Tümü") {
			setFilteredNotes(notes);
		} else {
			setFilteredNotes(
				notes.filter((note) => note.kategori === selectedCategory)
			);
		}
	}, [selectedCategory, notes]);

	return (
		<>
			<HeaderContainer />
			<div className="main-container">
				<div className="first-container">
					<h1>Bilmediklerinizi Öğrenin</h1>
					<p>
						Problemlerinize yardımcı olması için diğer insanlarla etkileşime
						geçin, onlara soru sorun ve cevaplarını öğrenin.
					</p>
					<div className="first-container-contents">
						<div className="search-input">
							<FaSearch className="search-icon" />
							<input placeholder="Search..." />
						</div>
						<div className="first-container-categories">
							<button
								className={`category-button ${
									selectedCategory === "Tümü" ? "active" : ""
								}`}
								onClick={() => setSelectedCategory("Tümü")}
							>
								Tümü
							</button>
							<button
								className={`category-button ${
									selectedCategory === "Teknoloji" ? "active" : ""
								}`}
								onClick={() => setSelectedCategory("Teknoloji")}
							>
								Teknoloji
							</button>
							<button
								className={`category-button ${
									selectedCategory === "Spor" ? "active" : ""
								}`}
								onClick={() => setSelectedCategory("Spor")}
							>
								Spor
							</button>
						</div>
					</div>
				</div>
				<div className="questions-grid">
					{loading ? (
						<p>Yükleniyor...</p>
					) : error ? (
						<p>{error}</p>
					) : filteredNotes.length === 0 ? (
						<p>Henüz yayınlanmış soru yok.</p>
					) : (
						filteredNotes.map((note) => (
							<div className="question-container" key={note.id}>
								<h2>{note.notBasligi}</h2>
								<p>{note.notAciklamasi}</p>
								<p>
									<strong>Soruyu soran: </strong> {note.kullaniciAdi}
								</p>
								<div className="details">
									<span>{new Date(note.tarih).toLocaleDateString()}</span>
									<span>{note.goruntulemeSayisi} görüntülenme</span>
								</div>
								<div
									className="btn"
									style={{ "--clr": "#78fd61", "--clr-glow": "#4003e6" }}
								>
									<div className="btn-glow"></div>
									<a href="#" onClick={() => openModal(note)}>
										Daha Fazla
									</a>
								</div>
							</div>
						))
					)}
				</div>

				{isModalOpen && selectedNote && (
					<div className="modal-overlay" onClick={closeModal}>
						<div className="modal-content" onClick={(e) => e.stopPropagation()}>
							<h2>{selectedNote.notBasligi}</h2>
							<p>
								<strong>Açıklama:</strong> {selectedNote.notAciklamasi}
							</p>
							<p>
								<strong>Kategori:</strong> {selectedNote.kategori}
							</p>
							<p>
								<strong>Soruyu soran: </strong> {selectedNote.kullaniciAdi}
							</p>
							<p>
								<strong>Tarih:</strong>{" "}
								{new Date(selectedNote.tarih).toLocaleDateString()}
							</p>
							<p>
								<strong>Görüntülenme Sayısı:</strong>{" "}
								{selectedNote.goruntulemeSayisi}
							</p>
							<button onClick={closeModal}>Kapat</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default AnaSayfa;
