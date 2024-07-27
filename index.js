const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 5000;

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "sorusor",
});

connection.connect((err) => {
	if (err) {
		console.log("Veritabanı bağlantısı sağlanamadı: ", err);
		return;
	}
	console.log("Veritabanı bağlantısı sağlandı.");
});

app.use(cors());
app.use(bodyParser.json());

// Kullanıcı Kaydı
app.post("/register", (req, res) => {
	const { kullaniciAdi, sifre } = req.body;

	connection.query(
		"SELECT * FROM kullanicilar WHERE kullaniciAdi = ?",
		[kullaniciAdi],
		(err, results) => {
			if (err) {
				res.status(500).send({ message: "Veritabanı hatası: ", error: err });
				return;
			}
			if (results.length > 0) {
				res
					.status(400)
					.send({ message: "Bu kullanıcı adı zaten kullanılmakta." });
				return;
			}

			connection.query(
				"INSERT INTO kullanicilar (kullaniciAdi, sifre) VALUES (?, ?)",
				[kullaniciAdi, sifre],
				(err) => {
					if (err) {
						res.status(500).send({
							message: "Kullanıcı kaydı sırasında hata oluştu: ",
							error: err,
						});
					} else {
						res
							.status(201)
							.send({ message: "Kullanıcı kaydı başarıyla tamamlandı." });
					}
				}
			);
		}
	);
});

// Kullanıcı Girişi
app.post("/login", (req, res) => {
	const { kullaniciAdi, sifre } = req.body;

	connection.query(
		"SELECT * FROM kullanicilar WHERE kullaniciAdi = ? AND sifre = ?",
		[kullaniciAdi, sifre],
		(err, results) => {
			if (err) {
				res.status(500).send({ message: "Veritabanı hatası: ", error: err });
				return;
			}
			if (results.length === 0) {
				res.status(401).send({ message: "Geçersiz kullanıcı adı veya şifre." });
			} else {
				res.status(200).send({ message: "Giriş başarılı." });
			}
		}
	);
});

// Kullanıcıya ait notları getir
app.get("/user-notes", (req, res) => {
	const { kullaniciAdi } = req.query;

	connection.query(
		"SELECT * FROM notlar WHERE kullaniciAdi = ?",
		[kullaniciAdi],
		(err, results) => {
			if (err) {
				res.status(500).send({ message: "Veritabanı hatası: ", error: err });
				return;
			}
			res.status(200).json(results);
		}
	);
});

// Tüm notları getir
app.get("/notes", (req, res) => {
	connection.query("SELECT * FROM notlar", (err, results) => {
		if (err) {
			res.status(500).send({ message: "Veritabanı hatası: ", error: err });
			return;
		}
		res.status(200).json(results);
	});
});

// Not ekleme
app.post("/notes", (req, res) => {
	const { notBasligi, notAciklamasi, kategori, tarih, kullaniciAdi } = req.body;

	connection.query(
		"INSERT INTO notlar (notBasligi, notAciklamasi, kategori, tarih, kullaniciAdi) VALUES (?, ?, ?, ?, ?)",
		[notBasligi, notAciklamasi, kategori, tarih, kullaniciAdi],
		(err) => {
			if (err) {
				res
					.status(500)
					.send({ message: "Not ekleme sırasında hata oluştu: ", error: err });
			} else {
				res.status(201).send({ message: "Not başarıyla eklendi." });
			}
		}
	);
});

// Not düzenleme
app.put("/notes/:id", (req, res) => {
	const { id } = req.params;
	const { notBasligi, notAciklamasi, kategori, tarih, goruntulemeSayisi } =
		req.body;

	connection.query(
		"UPDATE notlar SET notBasligi = ?, notAciklamasi = ?, kategori = ?, tarih = ?, goruntulemeSayisi = ? WHERE id = ?",
		[notBasligi, notAciklamasi, kategori, tarih, goruntulemeSayisi, id],
		(err) => {
			if (err) {
				res.status(500).send({
					message: "Not düzenleme sırasında hata oluştu: ",
					error: err,
				});
			} else {
				res.status(200).send({ message: "Not başarıyla güncellendi." });
			}
		}
	);
});

// Not silme
app.delete("/notes/:id", (req, res) => {
	const { id } = req.params;

	connection.query("DELETE FROM notlar WHERE id = ?", [id], (err) => {
		if (err) {
			res
				.status(500)
				.send({ message: "Not silme sırasında hata oluştu: ", error: err });
		} else {
			res.status(200).send({ message: "Not başarıyla silindi." });
		}
	});
});

app.listen(port, () => {
	console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
