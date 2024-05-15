const router = require("express").Router()
const { User, validate } = require("../Models/User")
const bcrypt = require("bcrypt")
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (user)
            return res
                .status(409)
                .send({ message: "User with given email already Exist!" })
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await new User({ ...req.body, password: hashPassword }).save()
        res.status(201).send({ message: "User created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})
router.get("/", async (req, res) => {
    //pobranie wszystkich użytkowników z bd:
    User.find().exec()
    .then(async () => {
        const users = await User.find();
        //konfiguracja odpowiedzi res z przekazaniem listy użytkowników:
        res.status(200).send({ data: users, message: "Lista użytkowników" });
    })
    .catch(error => {
        res.status(500).send({ message: error.message });
    });
})
router.get("/details", async (req, res) => {
    try {
      // Retrieve the user details from the database based on the authenticated user's ID
      const user = await User.findById(req.user._id).exec();

      if (!user) {
        // If the user is not found, return an error response
        return res.status(404).json({ message: "User not found" });
      }

      // Return the user details in the response
      res.status(200).json({ data: user, message: "Szczegóły konta" });
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: error.message });
    }
});
router.delete("/", async (req, res) => {
    try {
      // Retrieve the user details from the database based on the authenticated user's ID
      const deletedUser = await User.findByIdAndDelete(req.user._id);
        console.log("usuwanie")
      if (!deletedUser) {
        // If the user is not found, return an error response
        return res.status(404).json({ message: "User not found" });
      }

      // Return the user details in the response
      res.status(200).json({ message: 'Usunięto użytkownika' });
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: error.message });
    }
});
module.exports = router