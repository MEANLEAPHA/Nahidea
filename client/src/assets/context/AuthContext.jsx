// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//   const [user, setUser] = useState(null);

//   const [token, setToken] = useState(
//     localStorage.getItem("token")
//   );

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     if (!token) {
//       setLoading(false);
//       return;
//     }

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

//         const data = res.data.userData || res.data;

//         setUser({
//           id: data.id,
//           username: data.username,
//           avatar_url: data.avatar_url,
//           profession: data.profession,
//           work_location: data.work_place,
//           bio: data.bio,
//           nickname: data.nickname,
//         });

//       } catch (err) {

//         console.error(err);

//         localStorage.removeItem("token");

//         setToken(null);
//         setUser(null);

//       } finally {

//         setLoading(false);

//       }
//     };

//     fetchMe();

//   }, [token]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         setUser,
//         setToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
// AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import  getToken  from "../util/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));   // ✅ use helper
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
          { headers: { Authorization: `Bearer ${token}` } }
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
        localStorage.removeItem("tokenExpiry");
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
