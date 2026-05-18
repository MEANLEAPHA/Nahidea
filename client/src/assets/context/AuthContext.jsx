// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [username, setUsername] = useState('Guest');
//     const [avatar_url, setAvatar] = useState("https://api.dicebear.com/9.x/adventurer/svg?seed=Alex");
//     const [profession, setProfession] = useState(null);
//     const [work_location, setLocation] = useState(null);
//     const [bio, setBio] = useState("Come and join Nahidea's family!");
//     const [nickname, setNickname] = useState('whynotsignup');
//     const [userId, setUserId] = useState(null);
//     const [token, setToken] = useState(localStorage.getItem("token"));

//   useEffect(() => {
//     if (!token) return;

//     const fetchMe = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_SERVER_URL}/api/me`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.data;

//             const username = data.userData?.username || data.username;
//             const avatar = data.userData?.avatar_url || data.avatar_url;
//             const location = data.userData?.work_place || data.work_place;
//             const bio = data.userData?.bio || data.bio;
//             const nickname = data.userData?.nickname || data.nickname;
//             const profession = data.userData?.profession || data.profession;
//             const userId = data.userData?.id || data.id;

//       setUserId(userId);
//       setUsername(username);
//       setAvatar(avatar);
//       setLocation(location);
//       setBio(bio);
//       setNickname(nickname);
//       setProfession(profession);
//       } catch (err) {
//         console.error(err);
//         setUsername("Guest");
//         setAvatar("https://api.dicebear.com/9.x/adventurer/svg?seed=Alex");
//         setLocation(null);
//         setBio("Come and join Nahidea's family!");
//         setNickname("whynotsignup");
//         setProfession(null);
//         setUserId(null);
//         setToken(null);
//         localStorage.removeItem("token");
//       }
//     };

//     fetchMe();
//   }, [token]);

//   return (
//     <AuthContext.Provider value={{ username, avatar_url, profession, work_location, bio, nickname, userId, token }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchMe = async () => {

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.userData || res.data;

        setUser({
          id: data.id,
          username: data.username,
          avatar_url: data.avatar_url,
          profession: data.profession,
          work_location: data.work_place,
          bio: data.bio,
          nickname: data.nickname,
        });

      } catch (err) {

        console.error(err);

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);

      } finally {

        setLoading(false);

      }
    };

    fetchMe();

  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);