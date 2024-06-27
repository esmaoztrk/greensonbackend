var mongoose = require("mongoose");
var User = mongoose.model("user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const sendResponse = function (res, status, content) {
  res.status(status).json(content);
};

const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        role:"user",
        // Diğer kullanıcı bilgileri buraya eklenebilir
    };

    const token = jwt.sign(payload, 'gizliAnahtar', { expiresIn: '1h' }); // Örneğin, token 1 saat geçerli olacak şekilde ayarlanmış

    return token;
};
exports.login= async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Geçersiz e-posta veya şifre' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Geçersiz e-posta veya şifre' });
    }

    res.status(200).json({ success: true, token: generateToken(user) });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ success: false, message: 'Bir hata oluştu, lütfen tekrar deneyin.' });
  }
};

exports.register = async function(req, res)  {
  try {
    const { name, surname, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'E-posta zaten kullanılıyor' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, surname, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Kullanıcı kaydı başarılı' });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ success: false, message: 'Bir hata oluştu, lütfen tekrar deneyin.' });
  }
};

exports.getAllUsers = async function (req, res) {
    try {
      const users = await User.find();
      sendResponse(res, 200, users);
    } catch (error) {
      sendResponse(res, 500, { status: "Sunucu hatası" });
    }
  };


exports.getUser = async function(req, res) {
  const userId = req.params.userId; // İstek parametresinden kullanıcı ID'sini al
  try {
    const user = await User.findById(userId); // MongoDB'den kullanıcıyı ID'ye göre bul
    if (!user) {
      return sendResponse(res, 404, { success: false, message: 'Kullanıcı bulunamadı' });
    }
    sendResponse(res, 200, user); // Kullanıcıyı başarıyla bulunduysa ve gönderildiyse
  } catch (error) {
    sendResponse(res, 500, { success: false, message: 'Sunucu hatası' });
  }
};


exports.getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    // Kullanıcıyı bul
    const user = await User.findById(userId).populate('favorites'); // favorites alanını populate ederek ürünlerin tam bilgilerini getir

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json(user.favorites); // Favori ürünlerin tam bilgilerini dön
  } catch (error) {
    res.status(500).json({ message: 'Favori ürünler alınırken bir hata oluştu', error });
  }
};

exports.addFavorite = async function (req, res) {
  const { productId } = req.body;
  const { userId } = req.params;

  try {
    // Kullanıcıyı bul
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Favori ürünler arasında zaten varsa ekleme
    if (!user.favorites.some((fav) => fav.equals(productId))) {
      user.favorites.push(productId);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Favori eklenirken bir hata oluştu", error });
  }
};
exports.removeFavorite = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    // Kullanıcıyı bul
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Favori ürünler arasından ürünü kaldır
    user.favorites = user.favorites.filter(fav => fav.toString() !== productId);

    await user.save();

    res.status(200).json({ message: 'Favori ürün kaldırıldı' });
  } catch (error) {
    res.status(500).json({ message: 'Favori kaldırılırken bir hata oluştu', error });
  }
};




