import React from 'react';
import { Card,CardContent, Typography } from '@material-ui/core';
import "./infoBox.css";

function infoBox({ title, cases, total, ...props}) {
    return (
        <Card className="infoBox" onClick={props.onClick}>
            <CardContent>
                <Typography color="textSecondary">{title}</Typography>
                <h2 className="infoBox__cases">{cases}</h2>
                <Typography className="infoBox__total">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default infoBox
