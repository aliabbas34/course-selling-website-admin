import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import Edit from './components/Edit';
import { RecoilRoot } from 'recoil';

function App() {
    return (
        <RecoilRoot>
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-course" element={<CreateCourse />} />
                <Route path="/courses" element={<ShowCourses />} />
                <Route path={"/edit-course/:courseId"} element={<Edit/>}></Route>
            </Routes>
        </Router>
        </RecoilRoot>
    );
}

export default App;