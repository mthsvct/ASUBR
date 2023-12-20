import styles from './Logo.module.scss'


function Name() {
    return (
        <div className={styles.name}>
            <h1>A</h1>
            <h1>S</h1>
            <h1>U</h1>
            <h1>B</h1>
            <h1>R</h1>
        </div>
    )
}

function Description() {
    return (
        <p>Academic Subjects Recommender</p>
    )
}


export function Logo({ justName = false }: { justName?: boolean }) {
    return (
        <div className={styles.logo}>
            <Name />
            {justName == false ? <Description /> : null}
        </div>
    )
}