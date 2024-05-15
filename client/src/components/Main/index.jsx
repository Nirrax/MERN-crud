import styles from "./styles.module.css"
import { useState } from "react"
import axios from "axios"
import Users from "../Users.js"

const Main = () => {
    const [dane, ustawDane] = useState([])
    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [user, setDetails] = useState(null);
    const [h, setH] = useState("");
    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.reload()
    }
    const handleGetUsers = async (e) => {
        e.preventDefault()
        //pobierz token z localStorage:
        const token = localStorage.getItem("token")
        //jeśli jest token w localStorage to:
        if (token) {
            try {
                //konfiguracja zapytania asynchronicznego z tokenem w nagłówku:
                const config = {
                method: 'get',
                url: 'http://localhost:8080/api/users',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token }
            }
            //wysłanie żądania o dane:
            const { data: res } = await axios(config)
            //ustaw dane w komponencie za pomocą hooka useState na listę z danymi przesłanymi
            //z serwera – jeśli został poprawnie zweryfikowany token
            ustawDane(res.data) // `res.data` - zawiera sparsowane dane – listę
            setShowAccountDetails(false)
            setH(res.message)
            } catch (error) {
                if (error.response && error.response.status >= 400 &&error.response.status <= 500)
                {
                    localStorage.removeItem("token")
                    window.location.reload()
                }
            }
        }
    }
    const handleGetAccountDetails = async (e) => {
        e.preventDefault()
        //pobierz token z localStorage:
        const token = localStorage.getItem("token")
        //jeśli jest token w localStorage to:
        if (token) {
            try {
                //konfiguracja zapytania asynchronicznego z tokenem w nagłówku:
                const config = {
                method: 'get',
                url: 'http://localhost:8080/api/users/details',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token }
            }
            //wysłanie żądania o dane:
            const { data: res } = await axios(config)
            //ustaw dane w komponencie za pomocą hooka useState na listę z danymi przesłanymi
            //z serwera – jeśli został poprawnie zweryfikowany token
            setDetails(res.data) // `res.data` - zawiera sparsowane dane – listę
            setShowAccountDetails(true)
            setH(res.message)
            } catch (error) {
                if (error.response && error.response.status >= 400 &&error.response.status <= 500)
                {
                    localStorage.removeItem("token")
                    window.location.reload()
                }
            }
        }
    }
    const handleDeleteAccount = async (e) =>{
        e.preventDefault()
        const confirmed = window.confirm("Are you sure you want to delete your account?");
        var token = null
        if(confirmed){
            token = localStorage.getItem("token")
        }
        
        //jeśli jest token w localStorage to:
        if (token) {
            try {
                //konfiguracja zapytania asynchronicznego z tokenem w nagłówku:
                const config = {
                method: 'delete',
                url: 'http://localhost:8080/api/users/',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token }
            }
            //wysłanie żądania o dane:
            const { data: res } = await axios(config)
            //ustaw dane w komponencie za pomocą hooka useState na listę z danymi przesłanymi
            //z serwera – jeśli został poprawnie zweryfikowany token
            //setH(res.message)
            window.alert(res.message);
            localStorage.removeItem("token")
            window.location.reload()
            } catch (error) {
                if (error.response && error.response.status >= 400 &&error.response.status <= 500)
                {
                    localStorage.removeItem("token")
                    window.location.reload()
                }
            }
        }
    }
    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>MySite</h1>
                <button className={styles.white_btn} onClick={handleGetUsers}>
                    Users
                </button>
                <button className={styles.white_btn} onClick={handleGetAccountDetails}>
                    Account Details
                </button>
                <button className={styles.white_btn} onClick={handleDeleteAccount}>
                    Delete Account
                </button>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            <h2>{h}</h2>
            {showAccountDetails ? (
                <div>
                    <p>ID: {user._id}</p>
                    <p>Imie: {user.firstName}</p>
                    <p>Nazwisko: {user.lastName}</p>
                    <p>E-mail: {user.email}</p>
                </div>
            ): (
                dane.length > 0 ? <Users users={dane} /> : <p></p>
            )}
        </div>
    )
}
export default Main