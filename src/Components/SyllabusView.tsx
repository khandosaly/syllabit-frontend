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
  Modal,
  Select,
  SelectChangeEvent,
  Stack
} from "@mui/material";
import {Course, Evaluation, Syllabus, Topic} from "../Models/Syllabus";
import {useEffect, useState} from "react";
import {User} from "../Models/User";
import TextField from "@mui/material/TextField";
import {useNavigate, useParams} from "react-router-dom";
import Link from "@mui/material/Link";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


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

const mdTheme = createTheme({
    palette: {
      text: {
        disabled: '#000000'
      }
    },
  }
);

export default function SyllabusView() {
  const [open, setOpen] = useState(true);
  const [syllabus, setSyllabus] = useState<Syllabus>(new Syllabus());
  let { pk } = useParams();
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File>();
  let navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!!file) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // @ts-ignore
        reader.onload = () => resolve(reader.result.toString().split(',')[1]);
        reader.onerror = (error) => reject(error);
      });
      console.log(base64)
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1.0/syllabus/sign/${syllabus.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            keystore: base64,
            password: password
          }),
        });

        let file = await response.blob()
        var csvURL = window.URL.createObjectURL(file);
        let tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', `sign_${pk}.sign`);
        tempLink.click();
        window.location.reload();

      } catch (e) {
        alert("Не правильный пароль или подпись")
        console.log("error", e);
      }

    }
  };

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1.0/syllabus/retrieve/${pk}`, {
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
        setSyllabus(courses_json);
        console.log(syllabus)
      } catch (err) {
        console.log(err)
      }
    }
    fetchSyllabus()
  }, [])

  const toggleDrawer = () => {
    setOpen(!open);
  };

  async function generateDocx(){
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1.0/syllabus/generate/docx/${pk}/`, {
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
      let file = await response.blob()
      var csvURL = window.URL.createObjectURL(file);
      let tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', `syllabus_${pk}.docx`);
      tempLink.click();
    } catch (err) {
      console.log(err)
    }
  }
  async function signDocx(){

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
              Просмотр проекта
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
              {!!syllabus.course ? (
                <Grid item xs={12}>
                  <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                      Основные данные
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <FormControl fullWidth margin="normal" size="small">
                          <InputLabel id="label-id" required>Курс</InputLabel>
                          <Select labelId="label-id" id="demo-simple-select" label="Курс" disabled
                                  value={JSON.stringify(syllabus.course)}>
                            <MenuItem value={JSON.stringify(syllabus.course)}>{syllabus.course.name}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth margin="normal" size="small">
                          <InputLabel id="label-id" required>Год</InputLabel>
                          <Select labelId="label-id" id="demo-simple-select"
                                  value={syllabus?.year} label="Год" disabled>
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
                                  value={syllabus?.language} label="Язык" disabled>
                            <MenuItem value="KZ">Казахский</MenuItem>
                            <MenuItem value="RU">Русский</MenuItem>
                            <MenuItem value="EN">Английский</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    {!!syllabus?.pre_courses?.at(0)?.name ? (
                      <><Typography color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                        Пререквизиты
                      </Typography>
                        <Grid container spacing={1} direction="row" alignItems="center" justifyContent="left" sx={{m: 1}}>
                          {syllabus.pre_courses.map((c: Course) => (
                            <Grid item xs="auto">
                              <Chip label={c.name} variant="outlined" ></Chip>
                            </Grid>
                          ))}
                        </Grid></>
                    ) : <></>}
                    {!!syllabus?.post_courses?.at(0)?.name ? (
                      <><Typography color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                        Постреквизиты
                      </Typography>
                        <Grid container spacing={1} direction="row" alignItems="center" justifyContent="left" sx={{m: 1}}>
                          {syllabus.post_courses.map((c: Course) => (
                            <Grid item xs="auto">
                              <Chip label={c.name} variant="outlined" ></Chip>
                            </Grid>
                          ))}
                        </Grid></>
                    ) : <></>}
                  </Paper>
                </Grid>
              ) : <></>}
              {/*MAIN DATA END*/}

              {/*INSTRUCTORS START*/}
              <Grid item xs={12}>
                <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                  <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                    Инструкторы
                  </Typography>
                  <Grid container spacing={1} direction="row" alignItems="center" justifyContent="left" sx={{m: 1}}>
                    {syllabus.teachers.map((t: User) => (
                      <Grid item xs="auto">
                        <Chip label={t.name} variant="outlined" ></Chip>
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
                  <TextField margin="normal" required fullWidth label="Цель" size="small" multiline disabled
                             value={syllabus.purpose || ''} />
                  <TextField margin="normal" required fullWidth label="Задачи" size="small" multiline disabled
                             value={syllabus.tasks || ''} />
                  <TextField margin="normal" required fullWidth label="Результаты" size="small" multiline disabled
                             value={syllabus.results || ''} />
                  <TextField margin="normal" required fullWidth label="Описание" size="small" multiline disabled
                             value={syllabus.description || ''} />
                  <TextField margin="normal" required fullWidth label="Политика курса" size="small" multiline disabled
                             value={syllabus.policy || ''} />
                  <TextField margin="normal" required fullWidth label="Использованная литература" size="small" multiline
                             disabled value={syllabus.resources || ''} />
                  <TextField margin="normal" required fullWidth label="Методы" size="small" multiline disabled
                             value={syllabus.methods || ''} />
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
                               value={t.name || ''} disabled/>
                  ))}
                </Paper>
              </Grid>
              {/*TOPIC ENDS*/}

              {/*EVALUATION STARTS*/}
              {!!syllabus.evaluation ? (
                <Grid item xs={12}>
                  <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                      Система оценивания
                    </Typography>
                    <FormControl fullWidth margin="normal" size="small">
                      <InputLabel id="label-id" required>Выберите</InputLabel>
                      <Select labelId="label-id" id="demo-simple-select" required label="Выберите"
                              value={JSON.stringify(syllabus.evaluation)} disabled>
                        <MenuItem value={JSON.stringify(syllabus.evaluation)}>{syllabus.evaluation.name}</MenuItem>
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
              ) : <></>}
              {/*EVALUATION ENDS*/}

              {/*APPROVERS START*/}
              {!!syllabus.approvers?.at(0)?.user ? (
                <Grid item xs={12}>
                  <Paper sx={{p: 3, display: 'flex', flexDirection: 'column'}}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 1}}>
                      Лист согласования
                    </Typography>
                    <FormControl fullWidth margin="normal" size="small">
                      <InputLabel id="label-id" required>Координатор</InputLabel>
                      <Select labelId="label-id"  label="Координатор" disabled
                              value={JSON.stringify(syllabus?.approvers?.at(0)?.user)}>
                        <MenuItem value={JSON.stringify(syllabus?.approvers?.at(0)?.user)}>
                          {syllabus?.approvers?.at(0)?.user?.name}</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" size="small">
                      <InputLabel id="label-id" required>Декан</InputLabel>
                      <Select labelId="label-id"  label="Декан" disabled
                              value={JSON.stringify(syllabus?.approvers?.at(1)?.user)}>
                        <MenuItem value={JSON.stringify(syllabus?.approvers?.at(1)?.user)}>
                          {syllabus?.approvers?.at(1)?.user?.name}</MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>
              ): <></>}
              {/*APPROVERS END*/}

              <Grid container justifyContent="flex-end" sx={{mt:2}} spacing={3}>
                <Button variant="contained" size="medium" sx={{m:1}} onClick={()=>handleModalOpen()}>
                  Подписать
                </Button>
                <Button variant="outlined" size="medium" sx={{m:1}} onClick={()=>generateDocx()}>
                  Скачать документ
                </Button>
              </Grid>

              <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box component="form" onSubmit={handleSubmit} noValidate sx={modalStyle}>
                  <input required style={{display: 'none'}} id="raised-button-file" type="file" name="file"
                         onChange={(event) => {
                           if (!!event.target.files) {setFile(event.target.files[0]);}}}/>
                  <label htmlFor="raised-button-file">
                    <Button fullWidth variant="outlined" component="span" sx={{mt: 1}}>Выбрать файл подписи </Button>
                  </label>
                  <TextField margin="normal" required fullWidth name="password" label="Пароль" type="password" size="small"
                             onChange={(value) => setPassword(value.target.value)}/>
                  <Button type="submit" fullWidth variant="contained" sx={{mt: 2, mb: 2}}>Подписать</Button>
                </Box>
              </Modal>

            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

