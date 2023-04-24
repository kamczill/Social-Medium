import { styled } from "@mui/material";

const FormContainer = styled('div')({
        display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '1rem', 
          width:'600px', 
          minWidth:'250px', 
          margin: '1rem',
          padding: '2rem',
          background: 'rgba(5, 2, 2, 0)',
          borderRadius: '16px',
          boxShadow: `0 4px 30px rgba(0, 0, 0, 0.342)`,
          backdropFilter: 'blur(3px)',
        webkitBackdropFilter: 'blur(3px)',
          border: '1px solid rgba(255, 255, 255, 0.3)', 
          // backgroundColor: theme.palette.background.alt
});

export default FormContainer