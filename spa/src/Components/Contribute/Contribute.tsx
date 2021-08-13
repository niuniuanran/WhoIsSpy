import { Button } from "@material-ui/core"
import { useContext } from "react";
import ContentContainer from "../Shared/ContentContainer"
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { makeStyles } from '@material-ui/core/styles';
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";

const useStyles = makeStyles((theme) => ({
    option: {
        height: '4rem',
        width: '15rem',
        fontSize: '1rem',
        display: 'flex',
        margin: '3rem auto',
    },
    iconSpan: {
        padding: '3px 7px',
        position: 'relative',
        top: '4px'
    },
    link: {
        textDecoration: 'none',
        color: "inherit"
    }
  }));

export default function Contribute(){
    const {getText} = useContext(LanguageContext) as LanguageContextType

    return <ContentContainer allowBack>
       <div>
           <ContributionLink link="https://github.com/niuniuanran/whoisspy" text={getText("issueOrPr")} icon={<GitHubIcon/>} important/>
           <ContributionLink link="https://www.linkedin.com/in/anrann/" text={getText("connectWithMe")} icon={<LinkedInIcon/>}/>
       </div>
    </ContentContainer>
}

interface ContributionLinkProps {
    link: string,
    text: string,
    icon: JSX.Element
    important?: boolean
}

function ContributionLink({link, text, icon, important}: ContributionLinkProps) {
    const classes = useStyles()
    return  <Button variant={important? "contained": "outlined"} size="small" color="primary" className={classes.option}>
       <a href={link} className={classes.link} target="_blank" rel="noreferrer">
            <span className={classes.iconSpan}>
                {icon}
            </span>
            <span> 
                {text}
            </span>
        </a> 
    </Button>

}