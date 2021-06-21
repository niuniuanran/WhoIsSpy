import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Slider } from "@material-ui/core";

const PlayerNumSlider = withStyles({
    root: {
        position: 'absolute',
        width: "50%",
        left: '50%',
        top: '1rem',
      },
    track: {
        height: 6,
      },
    thumb: {
        height: '1rem',
        width: '1rem',
        border: '1px solid currentColor',
      },
    rail: {
        opacity: 1,
        backgroundColor: 'rgba(63, 81, 181, 0.38)',
        height: '1px',
        '&::after': {
            content: '""',
            height: '6px',
            width: '100%',
            position: 'absolute',
            bottom: '0px',
            top: '0px',
            left: '-100%',
            backgroundColor: 'currentColor',
            }
    },
    valueLabel: {
        fontSize: '1rem',
        top: -70,
        left: 'calc(-50% - 18px)',
        '& *': {
            width: '4rem',
            height: '4rem',
          },
    }
})(Slider)

const SpyNumSlider = withStyles({
    root: {
        position: 'absolute',
        width: "30%",
        left: '10%',
        top: '1rem'
      },
    track: {
        height: 6,
    },
    rail: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        opacity: 1,
        height: 0,
        '&::after': {
            content: '""',
            height: '6px',
            width: '33.33%',
            position: 'absolute',
            bottom: '0px',
            top: '0px',
            left: '-33.33%',
            backgroundColor: 'currentColor',
          }
      },
      thumb: {
        height: '1rem',
        width: '1rem',
        border: '1px solid currentColor',
      },
      mark: {
          color: '#424242',
          opacity: 0.8
      },
      valueLabel: {
        top: -70,
        left: 'calc(-50% - 18px)',
        '& *': {
            width: '4rem',
            height: '4rem',
          },
        '& span span': {
            fontSize: '1.2rem',
            position: 'absolute',
            top: '1rem',
            left: '-1rem'
        }
        }
})(Slider)

const useStyles = makeStyles((theme) => ({
    root: {
      position: 'relative',
      width: '100%',
      height: '5rem'
    },
  }));

export default function NumSettingSliders(){
    const classes = useStyles()
    return <div className={classes.root}>
            <PlayerNumSlider
                defaultValue={5}
                getAriaValueText={v => `${v} players`}
                aria-labelledby="number-of-players"
                step={1}
                min={5}
                max={10}
                marks
                valueLabelDisplay="on"   
                valueLabelFormat={v => `${v} players`}                 
            />    
            <SpyNumSlider
                defaultValue={1}
                getAriaValueText={v => `${v} spys`}
                aria-labelledby="number-of-spys"
                step={1}
                min={1}
                max={4}
                valueLabelDisplay="on"   
                color="secondary"
                marks
                valueLabelFormat={v => `${v} ${v > 1 ? 'spies' : 'spy'}`}
            />  
        </div>
}