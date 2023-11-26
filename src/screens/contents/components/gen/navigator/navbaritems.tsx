
import React, {useState} from "react";
import { Link } from 'react-router-dom';
import '../../../styles/component.css'
import { Icon } from "@mui/material";
type Props = {
    item: Items,
    active: any,
}

type Items = {
    path: string,
    id: number,
    title: string,

}

 const NavBarItems: React.FC<Props> = ({ item, active }) => {

    const [hover, setHover] = useState(false);
    return (
        <Link 
            to={item.path} 
            className={active ? 'tab-active': 'tab-inactive'} >
            <span className='tab-button'>{item.title}</span>
        </Link>
    )
}

export default NavBarItems;