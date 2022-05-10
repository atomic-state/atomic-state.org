import React from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

const FeatureList = [
  {
    title: "Easy to Use",
    description: (
      <>
        The Atomic State api is very similar to the the state API in modern
        versions of React with hooks.
      </>
    ),
  },
  {
    title: "SSR ready",
    description: (
      <>
        SSR is supported with Atomic State, configuring default atoms' and
        filters' values.
      </>
    ),
  },
  {
    title: "More features",
    description: (
      <>
        Support for actions (reducers), persistence, tabs synchronization in
        browsers whe using persistence, and more.
      </>
    ),
  },
]

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
