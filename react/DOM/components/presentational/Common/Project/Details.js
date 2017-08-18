import React, { PropTypes } from 'react';
import _ from 'lodash';
import Translate from 'react-translate-component';
import mailtoLink from 'mailto-link';
import { printFn } from '../../../../utils/index';
import { ProjectName, encodeProjectSharingProductIds } from '../../../../utils/projectSharingHelper';
import { ProductRow } from './index';

/**
 * How to display project records
 */
const Details = ({ projectData, projectItems, mailOptions }) => {
    const items = _.map(projectItems, (item) => (
        <ProductRow key={item.id} projectItemData={item} projectData={projectData} />
    ));
    const compiledMailTemplates = {
        sendProductsSubject: _.template(mailOptions.sendProducts.subjectTemplate),
        shareProductSubject: _.template(mailOptions.shareProject.subjectTemplate),
        shareProductUrlTemplate: _.template(mailOptions.shareProject.urlTemplate)
    };
    const projectListMailGenerator = (list) =>
        _.map(list, (item) => (
            `${item.quantity} x ${item.product.title}`
        )).join('\n\n');
    const productIds = encodeProjectSharingProductIds(projectItems).join(',');
    const productQuantities = projectItems.map((projectItem) => projectItem.quantity).join(',');
    return (
        <div className="ui fluid">
            <div className="list-title"><Translate content="label.app.project" />: {projectData.name}</div>
            <br /><br />
            <div className="list-container">
                <div className="project-rows ui middle aligned divided list">
                    {items}
                </div>
            </div>
            <div className="ui vertically padded grid">
                <div className="five wide computer sixteen wide tablet sixteen wide mobile column">
                    <a
                        className="send-products-link ui left labeled primary icon fluid button"
                        href={mailtoLink({
                            subject: compiledMailTemplates.sendProductsSubject({
                                projectName: projectData.name
                            }),
                            body: projectListMailGenerator(projectItems, projectData)
                        })}
                    >
                        <i className="mail outline icon"></i>
                        <Translate content="action.label.send" />
                    </a>
                </div>
                <div className="five wide computer sixteen wide tablet sixteen wide mobile column">
                    <a
                        className="share-project-link ui left labeled primary icon fluid button "
                        href={mailtoLink({
                            subject: compiledMailTemplates.shareProductSubject({
                                projectName: projectData.name
                            }),
                            body: compiledMailTemplates.shareProductUrlTemplate({
                                projectName: ProjectName.encode(projectData.name),
                                productIds,
                                quantities: productQuantities
                            })
                        })}
                    >
                        <i className="share alternate outline icon"></i>
                        <Translate content="action.label.share" />
                    </a>
                </div>
                <div className="five wide computer sixteen wide tablet sixteen wide mobile column">
                    <div className="project-print-link ui left labeled primary icon fluid button" onClick={printFn}>
                        <i className="print icon"></i>
                        <Translate content="action.label.print" />
                    </div>
                </div>
            </div>

        </div>
    );
};

Details.propTypes = {
    projectData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    projectItems: PropTypes.array.isRequired,
    mailOptions: PropTypes.shape({
        sendProducts: PropTypes.shape({
            subjectTemplate: PropTypes.string.isRequired
        }).isRequired,
        shareProject: PropTypes.shape({
            subjectTemplate: PropTypes.string.isRequired,
            urlTemplate: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default Details;
