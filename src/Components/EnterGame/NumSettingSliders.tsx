import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Slider } from "@material-ui/core";
import { useContext } from 'react'
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";

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
        height: 6,
        opacity: 1,
        backgroundColor: 'rgba(63, 81, 181, 0.38)',
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
        top: -46,
        left: 'calc(-50% - 8px)',
        '& *': {
            width: '2.8rem',
            height: '2.8rem',
          },
        '& span span': {
            width: '1.7rem',
            fontSize: '0.8rem',
            marginTop: '0.6rem',
            marginLeft: '-0.6rem'
        }
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
        top: -46,
        left: 'calc(-50% - 8px)',
        '& *': {
            width: '2.8rem',
            height: '2.8rem',
          },
        '& span span': {
            width: '1.7rem',
            fontSize: '0.8rem',
            marginTop: '0.5rem',
            marginLeft: '-0.6rem'
        }
    }
})(Slider)

const useStyles = makeStyles((theme) => ({
    root: {
      position: 'relative',
      width: '100%',
      height: '5rem',
      marginTop: '1rem',
    },
  }));

export default function NumSettingSliders(){
    const {getText} = useContext(LanguageContext) as LanguageContextType
    const classes = useStyles()
    return <div className={classes.root}>
            <PlayerNumSlider
                defaultValue={6}
                getAriaValueText={v => `${v} players`}
                aria-labelledby="number-of-players"
                step={1}
                min={5}
                max={10}
                marks
                valueLabelDisplay="on"   
                valueLabelFormat={v => `${v} ${getText("total")}`}                 
            />    
            <SpyNumSlider
                defaultValue={2}
                getAriaValueText={v => `${v} ${getText("spyPlural")}`}
                aria-labelledby="number-of-spys"
                step={1}
                min={1}
                max={4}
                valueLabelDisplay="on"   
                color="secondary"
                marks
                valueLabelFormat={v => `${v} ${v > 1 ? getText("spyPlural") : getText("spySingular")}`}
            />  
        </div>
}