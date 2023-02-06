import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './About.css';

function About() {
    const [subjArr, setSubjArr] = useState([]);
    const [subName, setSubName] = useState('');
    const [present, setPresent] = useState(0);
    const [absent, setAbsent] = useState(0);
    const [user, setUser] = useState('');
    const [goal, setGoal] = useState(0);

    const navigate = useNavigate();

    const callAboutUsPage = async () => {
        try {
            const res = await axios.get('http://localhost:3000/about',
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });

            const data = res.data;

            setUser(data.name)
            setSubjArr(data.subjects)
            setGoal(data.attendanceGoal)
        }
        catch (err) {
            navigate('/login');
        }
    }
    useEffect(() => {
        callAboutUsPage();
    }, []);


    let incrementPresent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;
            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) {
                    tempArr[i].present++;
                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;
                }
            }
            setSubjArr(tempArr);
            await axios.post('http://localhost:3000/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent
            })
        }
        catch (err) {
            console.log(err);
        }
    }
    let incrementAbsent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;

            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) {
                    tempArr[i].absent++;
                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;
                }
            }
            setSubjArr(tempArr);
            await axios.post('http://localhost:3000/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent
            })
        } catch (err) {
            console.log(err);
        }
    }
    let deleteSubject = async (subjectToBeDeleted) => {

        try {
            await axios.post('http://localhost:3000/deleteSubject', {
                name: user, subjectName: subjectToBeDeleted
            })
            let tempArr = [];
            for (let i = 0; i < subjArr.length; i++) {
                if (subjArr[i].name !== subjectToBeDeleted) {
                    tempArr.push(subjArr[i]);
                }
            }
            setSubjArr(tempArr);
        } catch (err) {
            console.log(err);
        }

    }
    let handleGoalChange = async (e) => {
        setGoal(e.target.value)

        try {
            await axios.post('http://localhost:3000/setGoal', {
                name: user, newGoal: e.target.value
            })
        } catch (err) {
            console.log(err)
        }
    }
    let handleSubmit = async (e) => {
        e.preventDefault();
        if (subName === '') {
            return;
        }
        try {
            let newSubj = { name: subName, present: present, absent: absent };
            let subjs = [...subjArr, newSubj];

            await axios.post('http://localhost:3000/createSubject', {
                name: user, subjectName: subName, pre: present, abs: absent
            })
            setSubjArr([...subjs]);
            setSubName('');
            setAbsent(0);
            setPresent(0);
            document.getElementById("input1clear").value = "";
            document.getElementById("input2clear").value = "";

        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='pleasant'>
            <div className='subject-container'>
                <h3>Attendance Goal: <input placeholder='goal' value={goal} onChange={(e) => handleGoalChange(e)}></input>%</h3>
                <h1>Subjects:</h1>
                <h3>
                    <ul>
                        {
                            subjArr.map((subj) => (
                                <>
                                    <div className='subjects'>
                                        <h4>
                                            {subj.name}:
                                            <span>Present: {subj.present}  <button type="button" className="btn btn-success" onClick={() => incrementPresent(subj.name)}>+</button></span>
                                            <span>Absent: {subj.absent}  <button type="button" className="btn btn-warning" onClick={() => incrementAbsent(subj.name)}>+</button></span>
                                            <span>Attendance: {(parseInt(subj.present) * 100 / Math.max((parseInt(subj.present) + parseInt(subj.absent)), 1)).toFixed(2)}%</span>
                                            <span><button type="button" className="btn btn-danger" onClick={() => deleteSubject(subj.name)}>Delete Subject</button></span><br />
                                            To maintain the set attendance goal, please attend next {Math.max((((goal * (parseInt(subj.absent) + parseInt(subj.present))) - 100 * parseInt(subj.present)) / (100 - goal)), 0)} classes<br />
                                            BTW you can miss the next {Math.floor(Math.max(0, ((100 * parseInt(subj.present) - ((parseInt(subj.present) + parseInt(subj.absent)) * goal)) / goal)))} classes and still maintain {goal}% attendance
                                        </h4>
                                    </div>
                                </>
                            ))
                        }
                    </ul>
                </h3>
                <form method="POST" onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" placeholder='Subject Name' value={subName} onChange={(e) => setSubName(e.target.value)} />
                    <input type="text" id='input1clear' placeholder='Total Number of days present' onChange={(e) => setPresent(e.target.value)} />
                    <input type="text" id='input2clear' placeholder='Total Number of days absent' onChange={(e) => setAbsent(e.target.value)} />
                    <button >Create a new subject</button>
                </form>
            </div>
        </div>
    )
}

export default About
