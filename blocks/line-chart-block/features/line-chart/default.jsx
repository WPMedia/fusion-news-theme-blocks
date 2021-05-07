import React from 'react';
import PropTypes from 'prop-types';
import { VictoryChart, VictoryLine, VictoryVoronoiContainer } from 'victory';

// import { useFusionContext } from 'fusion:context';

const LineChart = () => {
  // const { globalContent } = useFusionContext();

  const yFunction = (datum) => Math.sin(datum.x);
  const toolTipLabel = ({ datum }) => `${datum.x}, ${datum.y}`;

  return (
    <VictoryChart
      domainPadding={{ y: 10 }}
      containerComponent={(
        <VictoryVoronoiContainer labels={toolTipLabel} />
      )}
    >
      <VictoryLine y={yFunction} />
    </VictoryChart>
  );
};

LineChart.label = 'Line Chart – Arc Block';

LineChart.propTypes = {
  customFields: PropTypes.shape({
    lazyLoad: PropTypes.bool.tag({
      name: 'Lazy Load block?',
      defaultValue: false,
      description: 'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
    }),
  }),
};

export default LineChart;
