import * as React from 'react';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavList from "./NavList";
import {
  Button,
  Chip,
  FormControl,
  Input,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack
} from "@mui/material";
import {Course, Evaluation, Syllabus, Topic} from "../Models/Syllabus";
import {useEffect, useState} from "react";
import {User} from "../Models/User";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== 'open',})<AppBarProps>(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth, width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(({theme, open}) => ({
    '& .MuiDrawer-paper': {
      position: 'relative', whiteSpace: 'nowrap', width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp, duration:
        theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box', ...(!open && {
        overflowX: 'hidden', transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7), [theme.breakpoints.up('sm')]: {width: theme.spacing(9),},
      }),
    },
  }),
);

const mdTheme = createTheme();

export default function SyllabusForm() {
  const [open, setOpen] = useState(true);
  const [syllabus, setSyllabus] = useState<Syllabus>(new Syllabus());
  const [courses, setCourses] = useState(Array<Course>());
  const [evaluations, setEvaluations] = useState(Array<Evaluation>());
  const [teachers, setTeachers] = useState(Array<User>());
  const [selectedTeacher, setSelectedTeacher] = useState<User>();
  const [selectedPreCourse, setSelectedPreCourse] = useState<Course>();
  const [selectedPostCourse, setSelectedPostCourse] = useState<Course>();
  const [, updateState] = React.useState();
  let navigate = useNavigate();
  // @ts-ignore
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1.0/syllabus/courses`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
          }
        );
        if (response.status == 401) {
          localStorage.clear()
          window.location.reload();
        }
        let courses_json = await response.json();
        setCourses(courses_json);
      } catch (err) {
        setCourses([]);
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1.0/syllabus/teachers`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
          }
        );
        if (response.status == 401) {
          localStorage.clear()
          window.location.reload();
        }
        let courses_json = await response.json();
        setTeachers(courses_json);
      } catch (err) {
        setTeachers([]);
      }
    }
    fetchTeachers()
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1.0/syllabus/evaluation/`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
          }
        );
        if (response.status == 401) {
          localStorage.clear()
          window.location.reload();
        }
        let courses_json = await response.json();
        setEvaluations(courses_json);
      } catch (err) {
        setEvaluations([]);
      }
    }
    fetchCourses()
  }, [])

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const changeCourse = (event: SelectChangeEvent<Course>) => {
    event.preventDefault();
    // @ts-ignore
    syllabus.course = event.target.value
  };

  const changeYear = (event: SelectChangeEvent<String>) => {
    event.preventDefault();
    // @ts-ignore
    syllabus.year = event.target.value
  };

  const changeLanguage = (event: SelectChangeEvent<String>) => {
    event.preventDefault();
    // @ts-ignore
    syllabus.language = event.target.value
  };

  const changeSelectedTeacher = (event: SelectChangeEvent<User>) => {
    event.preventDefault();
    // @ts-ignore
    setSelectedTeacher(event.target.value)
  };

  const changeSelectedPreCourse = (event: SelectChangeEvent<Course>) => {
    event.preventDefault();
    // @ts-ignore
    setSelectedPreCourse(event.target.value)
  };

  const changeSelectedPostCourse = (event: SelectChangeEvent<Course>) => {
    event.preventDefault();
    // @ts-ignore
    setSelectedPostCourse(event.target.value)
  };

  const changeEval = (event: SelectChangeEvent<Evaluation>) => {
    event.preventDefault();
    // @ts-ignore
    syllabus.evaluation = event.target.value
    forceUpdate();
  };

  const changeCoordinator = (event: SelectChangeEvent<User>) => {
    event.preventDefault();
    // @ts-ignore
    syllabus.approvers.at(0).user = event.target.value;
    forceUpdate();
  };

  const changeDean = (event: SelectChangeEvent<User>) => {
    event.preventDefault();
    // @ts-ignore
    syllabus.approvers.at(1).user = event.target.value;
    forceUpdate();
  };

  function addTeacher() {
    if (selectedTeacher) {
      if (syllabus.teachers.map((u) => (u.id)).includes(selectedTeacher.id)) {
        alert(selectedTeacher.name + ' уже выбран')
      } else {
        syllabus.teachers.push(selectedTeacher)
      }
    }
    forceUpdate();
  }

  function addPreCourse() {
    if (selectedPreCourse) {
      if (syllabus.pre_courses.map((u) => (u.id)).includes(selectedPreCourse.id)) {
        alert(selectedPreCourse.name + ' уже выбран')
      } else {
        syllabus.pre_courses.push(selectedPreCourse)
      }
    }
    forceUpdate();
  }

  function addPostCourse() {
    if (selectedPostCourse) {
      if (syllabus.post_courses.map((u) => (u.id)).includes(selectedPostCourse.id)) {
        alert(selectedPostCourse.name + ' уже выбран')
      } else {
        syllabus.post_courses.push(selectedPostCourse)
      }
    }
    forceUpdate();
  }

  function deleteTeacherChip(t: User) {
    if (syllabus.teachers.map((u) => (u.id)).includes(t.id)) {
      syllabus.teachers = syllabus.teachers.filter(obj => obj.id !== t.id);
    }
    forceUpdate();
  }

  function deletePreCourseChip(t: Course) {
    if (syllabus.pre_courses.map((u) => (u.id)).includes(t.id)) {
      syllabus.pre_courses = syllabus.pre_courses.filter(obj => obj.id !== t.id);
    }
    forceUpdate();
  }

  function deletePostCourseChip(t: Course) {
    if (syllabus.post_courses.map((u) => (u.id)).includes(t.id)) {
      syllabus.post_courses = syllabus.post_courses.filter(obj => obj.id !== t.id);
    }
    forceUpdate();
  }

  async function submitAll(for_approve: Boolean) {
    if (for_approve){
      syllabus.status = "ON_APPROVING"
    } else{
      syllabus.status = "IN_PROGRESS"
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1.0/syllabus/create/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: syllabus.getJson(),
        }
      );
      if (response.status == 401) {
        localStorage.clear()
        window.location.reload();
      }
      if (response.status == 200){
        alert('Успешно создано!')
        navigate('/my-tables')
      }

    } catch (err) {
      console.log(err)
    }
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{display: 'flex'}}>
        <CssBaseline/>

        {/*TOOLBAR START*/}
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{pr: '24px'}}>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer}
                        sx={{marginRight: '36px', ...(open && {display: 'none'}),}}><MenuIcon/>
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1}}>
              Создание проекта
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary"><NotificationsIcon/></Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        {/*TOOLBAR END*/}

        {/*DRAWER START*/}
        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1],}}>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 2}}>
              SyllabIT
            </Typography>
            <IconButton onClick={toggleDrawer}><ChevronLeftIcon/></IconButton>
          </Toolbar>
          <Divider/>
          <NavList/>
        </Drawer>
        {/*DRAWER END*/}

        <Box
          component="main" sx={{flexGrow: 1, height: '100vh', overflow: 'auto',
          backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        }}>
          <Toolbar/>
          <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
            <Grid container spacing={3}>

              {/*MAIN DATA START*/}
              <Grid item xs={12}>
                <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                  <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                    Основные данные
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal" size="small">
                        <InputLabel id="label-id" required>Курс</InputLabel>
                        <Select labelId="label-id" id="demo-simple-select" required
                                value={syllabus?.course} label="Курс" onChange={changeCourse}>
                          {courses.map((c: Course) => (
                            //@ts-ignore
                            <MenuItem value={c}>{c.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth margin="normal" size="small">
                        <InputLabel id="label-id" required>Год</InputLabel>
                        <Select labelId="label-id" id="demo-simple-select"
                                value={syllabus?.year} label="Год" onChange={changeYear}>
                          <MenuItem value="2019-2020">2019-2020</MenuItem>
                          <MenuItem value="2020-2021">2020-2021</MenuItem>
                          <MenuItem value="2021-2022">2021-2022</MenuItem>
                          <MenuItem value="2022-2023">2022-2023</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth margin="normal" size="small">
                        <InputLabel id="label-id" required>Язык</InputLabel>
                        <Select labelId="label-id" id="demo-simple-select"
                                value={syllabus?.language} label="Язык" onChange={changeLanguage}>
                          <MenuItem value="KZ">Казахский</MenuItem>
                          <MenuItem value="RU">Русский</MenuItem>
                          <MenuItem value="EN">Английский</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} direction="row" alignItems="center" justifyContent="center">
                    <Grid item xs={10}>
                      <FormControl fullWidth margin="normal" size="small">
                        <InputLabel id="label-id">Пререквизиты</InputLabel>
                        <Select labelId="label-id" onChange={changeSelectedPreCourse}
                                value={selectedPreCourse} label="Пререквизиты">
                          {courses.map((c: Course) => (
                            //@ts-ignore
                            <MenuItem value={c}>{c.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={addPreCourse}>Добавить</Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} direction="row" alignItems="center" justifyContent="left" sx={{m: 1}}>
                    {syllabus.pre_courses.map((c: Course) => (
                      <Grid item xs="auto">
                        <Chip label={c.name} variant="outlined" onDelete={() => deletePreCourseChip(c)}></Chip>
                      </Grid>
                    ))}
                  </Grid>

                  <Grid container spacing={3} direction="row" alignItems="center" justifyContent="center">
                    <Grid item xs={10}>
                      <FormControl fullWidth margin="normal" size="small">
                        <InputLabel id="label-id">Постреквизиты</InputLabel>
                        <Select labelId="label-id" onChange={changeSelectedPostCourse}
                                value={selectedPostCourse} label="Постреквизиты">
                          {courses.map((c: Course) => (
                            //@ts-ignore
                            <MenuItem value={c}>{c.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={addPostCourse}>Добавить</Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} direction="row" alignItems="center" justifyContent="left" sx={{m: 1}}>
                    {syllabus.post_courses.map((c: Course) => (
                      <Grid item xs="auto">
                        <Chip label={c.name} variant="outlined" onDelete={() => deletePostCourseChip(c)}></Chip>
                      </Grid>
                    ))}
                  </Grid>

                </Paper>
              </Grid>
              {/*MAIN DATA END*/}

              {/*INSTRUCTORS START*/}
              <Grid item xs={12}>
                <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                  <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                    Инструкторы
                  </Typography>
                  <Grid container spacing={3} direction="row" alignItems="center" justifyContent="center">
                    <Grid item xs={10}>
                      <FormControl fullWidth margin="normal" size="small">
                        <InputLabel id="label-id" required>Преподаватель</InputLabel>
                        <Select labelId="label-id" onChange={changeSelectedTeacher}
                                value={selectedTeacher} label="Преподаватель">
                          {teachers.map((t: User) => (
                            //@ts-ignore
                            <MenuItem value={t}>{t.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={addTeacher}>Добавить</Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} direction="row" alignItems="center" justifyContent="left" sx={{m: 1}}>
                    {syllabus.teachers.map((t: User) => (
                      <Grid item xs="auto">
                        <Chip label={t.name} variant="outlined" onDelete={() => deleteTeacherChip(t)}></Chip>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              {/*INSTRUCTORS END*/}

              {/*TEXT DATA STARTS*/}
              <Grid item xs={12}>
                <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                  <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                    Текстовые данные
                  </Typography>
                  <TextField margin="normal" required fullWidth label="Цель" size="small" multiline
                             value={syllabus.purpose} onChange={
                    (e) => syllabus.purpose = e.target.value}/>
                  <TextField margin="normal" required fullWidth label="Задачи" size="small" multiline
                             value={syllabus.tasks} onChange={
                    (e) => syllabus.tasks = e.target.value}/>
                  <TextField margin="normal" required fullWidth label="Результаты" size="small" multiline
                             value={syllabus.results} onChange={
                    (e) => syllabus.results = e.target.value}/>
                  <TextField margin="normal" required fullWidth label="Описание" size="small" multiline
                             value={syllabus.description} onChange={
                    (e) => syllabus.description = e.target.value}/>
                  <TextField margin="normal" required fullWidth label="Политика курса" size="small" multiline
                             value={syllabus.policy} onChange={
                    (e) => syllabus.policy = e.target.value}/>
                  <TextField margin="normal" required fullWidth label="Использованная литература" size="small" multiline
                             value={syllabus.resources} onChange={
                    (e) => syllabus.resources = e.target.value}/>
                  <TextField margin="normal" required fullWidth label="Методы" size="small" multiline
                             value={syllabus.methods} onChange={
                    (e) => syllabus.methods = e.target.value}/>
                </Paper>
              </Grid>
              {/*TEXT DATA ENDS*/}

              {/*TOPIC STARTS*/}
              <Grid item xs={12}>
                <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                  <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                    Темы недель
                  </Typography>
                  {syllabus.topics.map((t: Topic) => (
                    <TextField margin="normal" required fullWidth label={`${t.week} неделя`} size="small" multiline
                               value={t.name} onChange={event => t.name=event.target.value}/>
                  ))}
                </Paper>
              </Grid>
              {/*TOPIC ENDS*/}

              {/*EVALUATION STARTS*/}
              <Grid item xs={12}>
                <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                  <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                    Система оценивания
                  </Typography>
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel id="label-id" required>Выберите</InputLabel>
                    <Select labelId="label-id" id="demo-simple-select" required
                            value={syllabus?.evaluation} label="Выберите" onChange={changeEval}>
                      {evaluations.map((e: Evaluation) => (
                        //@ts-ignore
                        <MenuItem value={e}>{e.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Grid container justifyContent="center" sx={{mt:2}}>
                    <Box component="img" alt=" " alignItems="center"
                         src={`${syllabus.evaluation?.photo}`}
                         sx={{height: 360, width: 720,
                           maxHeight: {xs: 360, md: 300}, maxWidth: {xs: 720, md: 600}}}
                    />
                  </Grid>
                </Paper>
              </Grid>
              {/*EVALUATION ENDS*/}

              {/*APPROVERS START*/}
              <Grid item xs={12}>
                <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                  <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                    Лист согласования
                  </Typography>
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel id="label-id" required>Координатор</InputLabel>
                    <Select labelId="label-id" onChange={changeCoordinator} label="Координатор"
                            value={syllabus?.approvers?.at(0)?.user}>
                      {teachers.map((t: User) => (
                        //@ts-ignore
                        <MenuItem value={t}>{t.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel id="label-id" required>Декан</InputLabel>
                    <Select labelId="label-id" onChange={changeDean} label="Декан"
                            value={syllabus?.approvers?.at(1)?.user}>
                      {teachers.map((t: User) => (
                        //@ts-ignore
                        <MenuItem value={t}>{t.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>
              {/*APPROVERS END*/}

              <Grid container justifyContent="flex-end" sx={{mt:2}} spacing={3}>
                <Button variant="outlined" size="medium" sx={{m:1}} onClick={()=>submitAll(false)}>
                  Создать проект
                </Button>
                <Button variant="contained" size="medium" sx={{m:1}} onClick={()=>submitAll(true)}>
                  Отправить на согласование
                </Button>
              </Grid>

            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

