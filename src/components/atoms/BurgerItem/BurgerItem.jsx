import { observer } from 'mobx-react-lite'
import React, { memo, useCallback } from 'react'
import { menu } from '../../../strore/menu'

const BurgerItem = observer(({ href, number, text }) => {
    const closeHandler = useCallback(() => {
        menu.setMenu(false)
    }, [])

    return (
        <div
            role="navigation"
            onClick={closeHandler}
            className="burger__item item "
        >
            <a href={href}>
                <div className="item__number">{number}</div>
                <div className="item__text">{text}</div>
            </a>
        </div>
    )
})

export default memo(BurgerItem)
