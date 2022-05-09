import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import KeyIcon from '@mui/icons-material/Key';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useState} from "react";
import {blue} from '@mui/material/colors';
import {useNavigate} from "react-router-dom";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        SyllabIT
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
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
        const response = await fetch(`http://127.0.0.1:8000/api/v1.0/auth/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;',
          },
          body: JSON.stringify({
            keystore: base64,
            password: password
          }),
        });

        const json = await response.json();
        if(response.status==200){
          localStorage.setItem('token', json.access)
          window.location.reload();
        } else{
          alert("Не правильный пароль или подпись")
        }
      } catch (e) {
        alert("Не правильный пароль или подпись")
        console.log("error", e);
      }

    }
  };

  // @ts-ignore
  return<ThemeProvider theme={theme}>
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{minHeight: '100vh'}}
    >

      <Grid item xs={3} sx={{boxShadow: 3}}>
        <Container component="main" maxWidth="xs">
          <CssBaseline/>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m: 1, bgcolor: blue[500]}}>
              <KeyIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Авторизация
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
              <input required style={{display: 'none'}} id="raised-button-file" type="file" name="file"
                     onChange={(event) => {
                       if (!!event.target.files) {
                         setFile(event.target.files[0]);
                       }
                     }}/>
              <label htmlFor="raised-button-file">
                <Button fullWidth variant="outlined" component="span" sx={{mt: 1}}>Выбрать файл подписи </Button>
              </label>
              <TextField margin="normal" required fullWidth name="password" label="Пароль" type="password"
                         size="small"
                         onChange={(value) => setPassword(value.target.value)}/>
              <Button type="submit" fullWidth variant="contained" sx={{mt: 2, mb: 2}}>Войти </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2"> Нужна помощь? </Link>
                </Grid>
                <Grid item>
                  <Link href="https://egov.kz/cms/ru/services/pass_onlineecp" variant="body2"> Получить ЭЦП</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{mt: 6, mb: 4}}/>
        </Container>
      </Grid>

    </Grid>
  </ThemeProvider>;
}
