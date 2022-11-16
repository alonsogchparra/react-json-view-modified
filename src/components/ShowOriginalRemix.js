import {
  Box,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  responsiveFontSizes,
  ThemeProvider,
  Typography,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import { useEffect, useState } from 'react';

let theme = createTheme();
theme = responsiveFontSizes(theme);

export const ShowOriginalRemix = () => {
  const [data, setData] = useState();
  const [cleanData, setCleanData] = useState();
  const [radioChoice, setRadioChoice] = useState('original');

  const getInfo = async () => {
    try {
      const info = await axios.get(
        'https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline'
      );

      const { data } = info;
      setData(data);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const radioChoiceHandler = () => {
    if (radioChoice === 'original') {
      setRadioChoice('modified');
    } else {
      setRadioChoice('original');
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    let tempData;
    if (data !== undefined && data !== '') {
      if (radioChoice === 'modified') {
        tempData = JSON.stringify(data, null, 1)
          .replace(/[[\]]/g, '')
          .replace(/[{}]/g, '')
          .replace(/"([^"]+)":/g, '$1:')
          .replace(/,/g, '');
        setCleanData(tempData);
      } else {
        tempData = JSON.stringify(data, null, 1);
        setCleanData(tempData);
      }
    }
  }, [data, radioChoice]);

  const showData =
    data === undefined || data.length === 0 ? (
      <>
        <Box
          sx={{ display: 'flex' }}
          textAlign='center'
          width='100%'
          justifyContent='center'
          alignItems='center'
          mt={4}
          mb={4}
        >
          <Typography variant='h3' component='div'>
            Loading...{' '}
          </Typography>
          <CircularProgress size={80} />
        </Box>
      </>
    ) : (
      <>
        <Box width='100%' my={2}>
          <FormControl>
            <RadioGroup
              row
              defaultValue={radioChoice}
              value={radioChoice}
              onChange={radioChoiceHandler}
            >
              <FormControlLabel
                value='original'
                control={<Radio />}
                label='Original'
              />
              <FormControlLabel
                value='modified'
                control={<Radio />}
                label='Modified'
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box
          width='90%'
          textAlign='left'
          height='400px'
          style={{ overflow: 'auto' }}
        >
          <pre
            style={{
              backgroundColor:
                radioChoice === 'original' ? '#faf6f1' : '#e1f0fd',
              padding: '25px',
            }}
            className='animate__animated animate__slow animate__fadeIn'
          >
            {cleanData}
          </pre>
        </Box>

        <Box width='100%' my={4}>
          <Grid container justifyContent='center' alignItems='center'>
            <Box m={1} pb={1}>
              <Typography variant='subtitle1' textAlign='center'>
                Also feel free to check the entire code on my{' '}
                <a
                  href='https://github.com/alonsogchparra'
                  target='_blank'
                  rel='noreferrer'
                >
                  github page
                </a>{' '}
              </Typography>
            </Box>

            <Box m={1}>
              <GitHubIcon fontSize='large' />
            </Box>
          </Grid>
        </Box>
      </>
    );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth='lg'
        className='animate__animated animate__slow animate__fadeIn'
      >
        <Grid
          container
          direction={'column'}
          justifyContent='center'
          alignItems='center'
          textAlign='center'
        >
          <Box width='100%' my={4}>
            <Typography variant='h2'>Showing JSON</Typography>
            <Divider />
          </Box>

          {showData}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
