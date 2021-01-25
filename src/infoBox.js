import React from 'react';
import { Card,CardContent, Typography } from '@material-ui/core';
import "./infoBox.css";

function infoBox({ title, cases, active, isRed, total, ...props}) {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} onClick={props.onClick}>
            <CardContent >
                <Typography color="textSecondary">{title}</Typography>
                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>
                <Typography className="infoBox__total">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default infoBox
