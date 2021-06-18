import React from 'react';

// import '@wpmedia/shared-styles/scss/_small-promo.scss';

function SmallPromoContainer({ headline, image, imagePosition = 'right' }) {
  const headlineClass = image
    ? 'col-sm-xl-8'
    : 'col-sm-xl-12';
  const imageClass = 'col-sm-xl-4';

  const imageOutput = (
    <div className={imageClass}>
      {image}
    </div>
  );

  const headlineOutput = (
    <div className={headlineClass}>
      {headline}
    </div>
  );

  let output = imagePosition === 'left' || imagePosition === 'above' ? (
    <>
      {imageOutput}
      {headlineOutput}
    </>
  ) : (
    <>
      {headlineOutput}
      {imageOutput}
    </>
  );

  if (imagePosition === 'left' || imagePosition === 'right') {
    output = (
      <div className="row">
        {output}
      </div>
    );
  }

  return (
    <>
      <article className="container-fluid small-promo">
        {output}
      </article>
      <hr />
    </>
  );
}
export default SmallPromoContainer;
