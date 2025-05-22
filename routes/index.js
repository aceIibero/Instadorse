const express = require("express");
const router = express.Router();
const db = require("../db");
const moment = require("moment")

router.get("/", async (req, res) => {
    // const profiles = [
    //   {
    //     "name": "Anya Petrova",
    //     "isVerified": true,
    //     "followerCount": 12300,
    //     "rating": 4.8,
    //     "reviewCount": 152,
    //     "categories": ["Yoga", "Meditation"],
    //     "bio": "Certified yoga instructor focused on holistic wellness.",
    //     "startingPrice": 750000,
    //     "username": "anyapetrova"
    //   },
    //   {
    //     "name": "Ben Carter",
    //     "isVerified": false,
    //     "followerCount": 580,
    //     "rating": 3.5,
    //     "reviewCount": 25,
    //     "categories": ["Photography"],
    //     "bio": "Passionate photographer capturing life's moments.",
    //     "startingPrice": 400000,
    //     "username": "bencarter"
    //   },
    //   {
    //     "name": "Citra Dewi",
    //     "isVerified": true,
    //     "followerCount": 21500,
    //     "rating": 4.9,
    //     "reviewCount": 210,
    //     "categories": ["Memasak", "Kue"],
    //     "bio": "Expert in Indonesian cuisine and baking delicious cakes.",
    //     "startingPrice": 550000,
    //     "username": "citradewi"
    //   },
    //   {
    //     "name": "David Lee",
    //     "isVerified": true,
    //     "followerCount": 9200,
    //     "rating": 4.2,
    //     "reviewCount": 88,
    //     "categories": ["Coding", "Web Development"],
    //     "bio": "Full-stack web developer helping businesses grow online.",
    //     "startingPrice": 900000,
    //     "username": "davidlee"
    //   },
    //   {
    //     "name": "Elena Rodriguez",
    //     "isVerified": false,
    //     "followerCount": 1800,
    //     "rating": 3.9,
    //     "reviewCount": 45,
    //     "categories": ["Painting", "Art"],
    //     "bio": "Artist exploring various mediums and creating unique pieces.",
    //     "startingPrice": 300000,
    //     "username": "elenarodriguez"
    //   },
    //   {
    //     "name": "Faisal Rahman",
    //     "isVerified": true,
    //     "followerCount": 15600,
    //     "rating": 4.5,
    //     "reviewCount": 120,
    //     "categories": ["Musik", "Gitar"],
    //     "bio": "Professional guitarist offering lessons and performances.",
    //     "startingPrice": 650000,
    //     "username": "faisalrahman"
    //   },
    //   {
    //     "name": "Grace Miller",
    //     "isVerified": false,
    //     "followerCount": 310,
    //     "rating": 4.1,
    //     "reviewCount": 15,
    //     "categories": ["Writing", "Copywriting"],
    //     "bio": "Creative writer crafting compelling content for brands.",
    //     "startingPrice": 450000,
    //     "username": "gracemiller"
    //   },
    //   {
    //     "name": "Hiroshi Tanaka",
    //     "isVerified": true,
    //     "followerCount": 11000,
    //     "rating": 4.7,
    //     "reviewCount": 95,
    //     "categories": ["Fotografi", "Videografi"],
    //     "bio": "Visual storyteller specializing in photography and videography.",
    //     "startingPrice": 800000,
    //     "username": "hiroshitanaka"
    //   },
    //   {
    //     "name": "Isabella Silva",
    //     "isVerified": false,
    //     "followerCount": 680,
    //     "rating": 3.7,
    //     "reviewCount": 30,
    //     "categories": ["Fashion", "Styling"],
    //     "bio": "Fashion enthusiast and personal stylist helping people look their best.",
    //     "startingPrice": 500000,
    //     "username": "isabellasilva"
    //   },
    //   {
    //     "name": "Joko Susilo",
    //     "isVerified": true,
    //     "followerCount": 18500,
    //     "rating": 4.6,
    //     "reviewCount": 175,
    //     "categories": ["Olahraga", "Lari"],
    //     "bio": "Experienced running coach and fitness motivator.",
    //     "startingPrice": 700000,
    //     "username": "jokosusilo"
    //   }
    // ]

try {
  const profiles = await db.query(`
    SELECT
      p.name,
      p.followerCount,
      GROUP_CONCAT(c.nama ORDER BY c.nama SEPARATOR ',') AS categories,
      p.bio,
      p.startingPrice,
      p.username
  FROM
      profiles p
  JOIN
      profiles_categories pc ON p.id = pc.id_profile
  JOIN
      categories c ON pc.id_category = c.id
  GROUP BY
      p.id, p.name, p.followerCount, p.bio, p.startingPrice, p.username;
      `);

      const states = [ 'secondary', 'info','warning', ]

      //fix categories to array
      profiles.forEach(profile => {
        profile.categories = profile.categories.split(",")

        profile.categories = profile.categories.map(category => ({
          name: category,
          color: states[Math.floor(Math.random() * states.length)]
        }));

        // if startingPrice is > 1000 convert to 1K 
        if (profile.startingPrice > 1000) {
          profile.startingPrice = `${Math.floor(profile.startingPrice / 1000)}K`
        }

        // followerCount > 1000 convert to 1K , 1000000 to 1M
        if (profile.followerCount >= 1000 && profile.followerCount < 1000000) {
          const followerCount = profile.followerCount / 1000
          profile.followerCount = `${followerCount % 1 === 0 ? followerCount : followerCount.toFixed(1)}K`
        } else if (profile.followerCount >= 1000000) {
          const followerCount = profile.followerCount / 1000000
          profile.followerCount = `${followerCount % 1 === 0 ? followerCount : followerCount.toFixed(1)}M`
        }
      })
  
      console.log(profiles);
    res.render("index", {
      title: "Home",
      message: "Welcome to the Home Page",
      profiles: profiles,
    });
} catch (error) {
    console.error(error)
    res.send(error)
}
});

router.get("/auth/sign-up", (req, res) => {
    
    res.render("auth/signup", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });

router.get("/auth/login", (req, res) => {
    
    res.render("auth/login", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });

router.get("/profiles", (req, res) => {
    
    res.render("profiles", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });

router.get("/profile/add", (req, res) => {
    
    res.render("profile-add", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });

  router.get("/manage-user", (req, res) => {
    
    res.render("manage-user", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });

  router.get("/manage-category", (req, res) => {
    
    res.render("manage-category", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });

  router.get("/user-setting", (req, res) => {
    
    res.render("user-setting", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });

  router.get("/profile", (req, res) => {
    
    res.render("profile", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });

  router.get("/about", (req, res) => {
    
    res.render("about", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });

  router.get("/contact", (req, res) => {
    
    res.render("contact", {
      title: "Home",
      message: "Welcome to the Home Page",
    });
  });


  router.get("/categories/:id/delete", (req, res) => {

    const id = req.params.id;
    db.query(`DELETE FROM categories WHERE id = ?`, [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error deleting category");
      } else {
        res.redirect("/manage-category");
      }
    });

  // redirect to manage-category
  res.redirect("/manage-category");
  });

  


module.exports = router;
