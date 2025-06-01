import { BlogPost } from '../../types/blog';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { NormComparisonChart } from '../../components/visuals/NormComparisonChart';
import { ClusterwiseRegressionVis } from '../../components/visuals/ClusterwiseRegressionVis';
import { CitationTooltip } from '../../components/CitationTooltip';

const post: BlogPost = {
  slug: 'clusterwise-linear-regression',
  title: 'Clusterwise Linear Regression',
  description: 'Späth Algorithm for Clusterwise Linear Regression',
  date: '2025-05-31',
  // tags: ['Machine Learning', 'Statistics', 'Algorithms'],
  content: (
    <>
      <p>
        {`
          Clusterwise linear regression is a technique used for approximating data using more than one
          linear function. It is based on the combination of
          clustering and multiple linear regression methods.
        `}
      </p>

      <p>
        {`I was first introduced to this problem by `}
        <a 
          href="https://www.julienugon.fr/webpage.html#home" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Assoc. Prof. Julien Ugon
        </a>
        {` at Deakin University. He and others have done work on this type of problem, which out perform the Späth algorithm using an incremental approach `}
       <a href="https://www.sciencedirect.com/science/article/pii/S0377221713002087" target="_blank" rel="noopener noreferrer">
        <CitationTooltip
          citationNumber={1}
          authors={["Adil M. Bagirov", "Julien Ugon", "Hijran Mirzayeva"]}
          title="Nonsmooth nonconvex optimization approach to clusterwise linear regression  problems"
          journal="European Journal of Operational Research"
          year={2013}
          doi="https://doi.org/10.1016/j.ejor.2013.02.059"
          url="https://www.sciencedirect.com/science/article/pii/S0377221713002087"
        />
        </a>.
      </p>

      <p>
        In this post we will focus just on the Späth algorithm, which is a good starting point. However, I do recommend taking a look at the incremental approach.
      </p>
          
      <h2>Problem Definition</h2>
      <p>
        {`Given a dataset `}
        <InlineMath>{`A = \\{(a_i, b_i) \\in \\mathbb{R}^n \\times \\mathbb{R}: i = 1, ..., m\\}`}</InlineMath>
        {`, the goal of clusterwise regression is to find simultaneously an optimal partition of data in `}
        <InlineMath>{`k`}</InlineMath>
        {` clusters and regression coefficients `}
        <InlineMath>{`\\{x_j, y_j\\}, j=1,...,k`}</InlineMath>
        {` within clusters in order to minimise the overall fit.`}
      </p>

      <p>
        {`This means we are working with a problem involving a dataset of `}
        <InlineMath>{`m`}</InlineMath>
        {` data points. Each data point has features `}
        <InlineMath>{`a_i`}</InlineMath>
        {` (which can be `}
        <InlineMath>{`n`}</InlineMath>
        {`-dimensional) and `}
        <InlineMath>{`b_i`}</InlineMath>
        {` is a single scalar value belonging to the real numbers.`}
      </p>

      <p>
        {`To do this, we minimise the overall fit (total regression error across all clusters) using:`}
      </p>

      <div className="my-4 p-4 rounded">
        <BlockMath>{`h(x^j, y_j, a^i, b_i) = |\\langle x^j, a^i \\rangle + y_j - b_i|^p`}</BlockMath>
      </div>

      <p>
        {`Where `}
        <InlineMath>{`h`}</InlineMath>
        {` is our error function which takes the following components:`}
      </p>

      <ul>
        <li>
          <InlineMath>{`x_j`}</InlineMath>
          {` is the vector of coefficients for cluster `}
          <InlineMath>{`j`}</InlineMath>
        </li>
        <li>
          <InlineMath>{`y_j`}</InlineMath>
          {` is the bias term for cluster `}
          <InlineMath>{`j`}</InlineMath>
        </li>
        <li>
          <InlineMath>{`a^i`}</InlineMath>
          {` is the feature vector for data point `}
          <InlineMath>{`i`}</InlineMath>
        </li>
        <li>
          <InlineMath>{`b_i`}</InlineMath>
          {` is the target value for data point `}
          <InlineMath>{`i`}</InlineMath>
        </li>
      </ul>

      <p>
        {`The function computes the inner product between coefficient vector and the feature vector `}
        <InlineMath>{`\\langle x^j, a^i \\rangle`}</InlineMath>
        {` and together `}
        <InlineMath>{`\\langle x^j, a^i \\rangle + y_j`}</InlineMath>
        {` represents the prediction made by the `}
        <InlineMath>{`j`}</InlineMath>
        {`-th cluster's linear model for the `}
        <InlineMath>{`i`}</InlineMath>
        {`-th data point.`}
      </p>

      <p>
        {`The complete term `}
        <InlineMath>{`|\\langle x^j, a^i \\rangle + y_j - b_i|^p`}</InlineMath>
        {` then measures how far this prediction deviates from the actual value `}
        <InlineMath>{`b_i`}</InlineMath>
        {`.`}
      </p>

      <p>
        {`Here, parameter `}
        <InlineMath>{`p`}</InlineMath>
        {` represents the norm used to measure the regression error in the objective function.`}
      </p>

      <h6>
        <b>{`Different values of `}</b>
        <InlineMath>{`p`}</InlineMath>
        <b>{` will result in different norms`}</b>
      </h6>

      <p>
        {`For `}<InlineMath>{`p=2`}</InlineMath>{`, we get quadratic growth (U-shaped parabola), while `}<InlineMath>{`p=1`}</InlineMath>{` gives us linear growth (V-shaped with sharp point at zero).`}
      </p>

      <div className="my-8">
        <NormComparisonChart />
      </div>

      <p>
        {`The visualisation shows that `}<InlineMath>{`p=1`}</InlineMath>{` penalises large errors `}<InlineMath>{`(|x|>1)`}</InlineMath>{` less than `}<InlineMath>{`p=2`}</InlineMath>{`, while for small errors `}<InlineMath>{`(|x|<1)`}</InlineMath>{`, `}<InlineMath>{`p=2`}</InlineMath>{` is more forgiving.`}
      </p>

      <p>
        {`The choice of `}
        <InlineMath>{`p`}</InlineMath>
        {` is important because it affects the sensitivity of the model to errors. However, in this post we will not ponder on the matter but rather focus on the algorithm.`}
      </p>

      <h2>The Späth Algorithm</h2>
      <p>
        {`The Späth algorithm is a method that extends the well-known `}
        <InlineMath>{`k`}</InlineMath>
        {`-means clustering approach to regression problems and was introduced in `}
        <a href="https://link.springer.com/article/10.1007/BF02265317" target="_blank" rel="noopener noreferrer">
          <CitationTooltip
            citationNumber={2}
            authors={["Späth, H."]}
            title="Algorithm 39 Clusterwise linear regression"
            journal="Computing"
            volume={22}
            year={1979}
            pages="367-373"
            doi="https://doi.org/10.1007/BF02265317"
            url="https://link.springer.com/article/10.1007/BF02265317"
          />
        </a>.
        {` around the 1980s. The algorithm is as follows:`}
      </p>

      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <strong>Initialisation:</strong>
          <ul className="list-disc pl-6 mt-1">
            <li>Randomly partition <InlineMath>{`A`}</InlineMath> into <InlineMath>{`k`}</InlineMath> clusters <InlineMath>{`A_1, ..., A_k`}</InlineMath> where <InlineMath>{`A_j \\subseteq A`}</InlineMath></li>
            <li>Set iteration counter <InlineMath>{`t = 0`}</InlineMath></li>
          </ul>
        </li>
        <li>
          <strong>Repeat until convergence:</strong>
          <ul className="list-disc pl-6 mt-1">
            <li>For each cluster <InlineMath>{`j = 1, ..., k`}</InlineMath>:
              <ul className="list-disc pl-6 mt-1">
                <li>Compute regression coefficients <InlineMath>{`(x^j, y_j)`}</InlineMath> by solving:
                  <div className="my-2">
                    <BlockMath>{`\\min_{x^j, y_j} \\sum_{(a^i,b_i) \\in A_j} |\\langle x^j, a^i \\rangle + y_j - b_i|^p`}</BlockMath>
                  </div>
                </li>
              </ul>
            </li>
            <li>For each data point <InlineMath>{`(a^i,b_i) \\in A`}</InlineMath>:
              <ul className="list-disc pl-6 mt-1">
                <li>Assign <InlineMath>{`(a^i,b_i)`}</InlineMath> to cluster <InlineMath>{`A_j`}</InlineMath> where:
                  <div className="my-2">
                    <BlockMath>{`j = \\argmin_{l=1,...,k} |\\langle x^l, a^i \\rangle + y_l - b_i|^p`}</BlockMath>
                  </div>
                </li>
              </ul>
            </li>
            <li>Increment <InlineMath>{`t = t + 1`}</InlineMath></li>
          </ul>
        </li>
        <li>
          <strong>Convergence:</strong> {`Stops when the cluster assignments stabilise which results in `}<InlineMath>{`k`}</InlineMath>{` clusters each with their own optimised regression model.`}
        </li>
      </ol>

      <h4>How it works</h4>

      <p>
       {`You can adjust the parameters to see how the algorithm performs under different configurations.`}
      </p>

      <div className="my-8">
        <ClusterwiseRegressionVis />
      </div>

      <p>
        {`From the visualisation, we can see that the algorithm is highly sensitive to cluster initialisation so poor initial assignments can lead to suboptimal results.`}
      </p>

      <p>
      This is because it makes locally optimal decisions at each step without considering the global picture. The workaround is to run the algorithm with different initialisations and take the best result. However, of course this isn't a very efficient workaround.
      </p>

      <h2>Applications</h2>
      <p>
        There are many applications of clusterwise linear regression, and it is useful in finding segments of data that have different linear relationships.
        Of course, it is not limited to linear relationships, and can be used to find segments of data that have different non-linear relationships.
      </p>

      <p>
        When data contains multiple subpopulations with different linear relationships, 
        clusterwise linear regression simultaneously clusters the data and fits separate 
        linear models to each cluster, uncovering heterogeneous patterns that would be 
        missed by a single linear regression model.
      </p>

      <p>
        The beauty of regression lies in its interpretability. It provides clear insights into 
        how each feature influences the target variable, allowing us to quantify these relationships 
        and make more informed decisions.
      </p>

      <h2>Closing remarks</h2>

      <p>
        Clusterwise linear regression is a method for finding both optimal data partitions and regression coefficients simultaneously.
        While a brief introduction, I hope you have enjoyed it and learned something new.
      </p>

      <p>
        For the interested reader, the following are some references:
      </p>

      <ul className="space-y-2">
        <li>
          <a href="https://www.sciencedirect.com/science/article/pii/S0377221713002087" target="_blank" rel="noopener noreferrer">
          Nonsmooth nonconvex optimization approach to clusterwise linear regression problems
          <CitationTooltip
            citationNumber={1}
            authors={["Adil M. Bagirov", "Julien Ugon", "Hijran Mirzayeva"]}
            title="Nonsmooth nonconvex optimization approach to clusterwise linear regression  problems"
            journal="European Journal of Operational Research"
            year={2013}
            doi="https://doi.org/10.1016/j.ejor.2013.02.059"
            url="https://www.sciencedirect.com/science/article/pii/S0377221713002087"
          />
        </a>
        </li>
        <li>
        <a href="https://link.springer.com/article/10.1007/BF02265317" target="_blank" rel="noopener noreferrer">
        Algorithm 39 Clusterwise linear regression
          <CitationTooltip
            citationNumber={2}
            authors={["Späth, H."]}
            title="Algorithm 39 Clusterwise linear regression"
            journal="Computing"
            volume={22}
            year={1979}
            pages="367-373"
            doi="https://doi.org/10.1007/BF02265317"
            url="https://link.springer.com/article/10.1007/BF02265317"
          />
        </a>
        </li>
      </ul>
    </>
  )
};

export default post; 