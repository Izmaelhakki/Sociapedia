import User from "../models/User.js";

//READ
export const getUser = async (req, res) => {
  try {
    //gelen parametreden id değeri cıkarıldı arama yapıldı ve user geri gönderildi
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    //parametreden gelen user bulunur
    const { id } = req.params;
    const user = await User.findById(id);
    //userın arkadasları array olarka listelenir
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    //front end için uygun obje formuna geçirilir
    const formattedFriends = friends.map(
      ({ _id, firstname, lastname, occupation, location, picturePath }) => {
        return { _id, firstname, lastname, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
};

//UPDATE

export const addRemoveFriend = async (req, res) => {
  try {
    //user ve eklenecek yada cıkarılacak kişi parametrelerden değişkenlere atanır
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    //userda kişi varmı kontol edildi varsa hem userdan hemde ilgili kişinin arkadaş listelerine ekleme yada çıkarma yapılır
    if (user.friends.includes(friendId)) {
      user.friend = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    //yapılan dizi işlemleri database kayıt edilir
    await user.save();
    await friend.save();

    //userın arkadasları array olarka listelenir
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    //front end için uygun obje formuna geçirilir
    const formattedFriends = friends.map(
      ({ _id, firstname, lastname, occupation, location, picturePath }) => {
        return { _id, firstname, lastname, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
