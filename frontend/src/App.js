import { BrowserRouter, Navigate, Routes, Route, HashRouter } from 'react-router-dom';
import Homepage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import ProfilePage from './scenes/profilePage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles"
import { themeSettings } from "./theme"


function App() {
  const mode = useSelector((state) => state.main.mode);
  const theme = useMemo(() => createTheme((themeSettings(mode)), [mode]))
  const loggedIn = useSelector((state) => state.main.isLoggedIn)
  const user = useSelector(state => state.main.user)
  const isAuth = (loggedIn == 'True' && user) ? true : false
  

  return (
    <div>
      <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path='/'element={isAuth ? <Homepage /> : <LoginPage/>}/>
              <Route path='/home' element={isAuth ? <Homepage/> : <Navigate to='/' />}/>
              <Route path='/profile/:userId' element={isAuth ? <ProfilePage/> : <Navigate to='/'/>}/>
        </Routes>
      </ThemeProvider>
      </HashRouter>
    </div>
  );
}

export default App;
