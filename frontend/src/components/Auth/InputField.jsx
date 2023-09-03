import { TextField, Grid, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const InputField = ({ handleShowPassword, half, ...otherProps }) => {
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
        {...otherProps}
        fullWidth
        InputProps={
          otherProps.name === "password" ? {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword}>
                  {otherProps.type === "password" ? (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          } : {}
        }
      />
    </Grid>
  );
};

export default InputField;
