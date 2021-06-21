import { withStyles } from '@material-ui/core/styles';
import { Slider } from "@material-ui/core";

const PlayerNumSlider = withStyles({
    root: {
        width: "20rem"
      },
    track: {
        height: 6,
      },
})(Slider)

const SpyNumSlider = withStyles({
    root: {
        width: "4rem"
      },
    track: {
        height: 6,
      },
    rail: {
        opacity: 0,
        height: 0,
      },
})(Slider)

export default function NumSettingSliders(){
    return <div>
            <PlayerNumSlider
                defaultValue={5}
                getAriaValueText={v => `${v} players`}
                aria-labelledby="number-of-players"
                step={1}
                min={0}
                max={12}
                valueLabelDisplay="on"                    
            />    
            <SpyNumSlider
                style={{position: 'relative', bottom: '45px'}}
                defaultValue={1}
                getAriaValueText={v => `${v} spys`}
                aria-labelledby="number-of-spys"
                step={1}
                min={0}
                max={12}
                valueLabelDisplay="on"   
                color="secondary"                 
            />  
        </div>
}