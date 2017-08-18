import * as Models from './index';

class ModelsFactory {
    constructor(dispatch) {
        this.dispatch = dispatch;
    }

    // Common

    get ['User']() {
        return new Models.User(
            this.dispatch
        );
    }

    get ['Routing']() {
        return new Models.Routing(
            this.dispatch
        );
    }

    ['ProjectProducts'](subStateNamespace) {
        return new Models.ProjectProducts(
            this.dispatch,
            `ProjectProducts.${subStateNamespace}`
        );
    }

    // Retrofit models

    get ['Retrofit.OriginalsModels.Parameters']() {
        return new Models.Retrofit.OriginalsModels.Parameters(
            this.dispatch,
            this['Retrofit.Modes']
        );
    }

    get ['Retrofit.ProductsModels.Parameters']() {
        return new Models.Retrofit.ProductsModels.Parameters(
            this.dispatch,
            this['Retrofit.Modes'],
            this['Retrofit.Original']
        );
    }

    get ['Retrofit.Accessories']() {
        return new Models.Retrofit.Accessories(
            this.dispatch,
            this['Retrofit.Modes'],
            this['Retrofit.Original']
        );
    }

    get ['Retrofit.Comparison']() {
        return new Models.Retrofit.Comparison(
            this.dispatch,
            this['Retrofit.Modes'],
            this['Retrofit.Original'],
            this['Retrofit.Product']
        );
    }

    get ['Retrofit.Modes']() {
        return new Models.Retrofit.Modes(
            this.dispatch
        );
    }

    get ['Retrofit.Original']() {
        return new Models.Retrofit.Original(
            this.dispatch
        );
    }

    get ['Retrofit.Originals']() {
        return new Models.Retrofit.Originals(
            this.dispatch,
            this['Retrofit.Modes'],
            this['Retrofit.Text'],
            this['Retrofit.OriginalsModels.Parameters']
        );
    }

    get ['Retrofit.Product']() {
        return new Models.Retrofit.Product(
            this.dispatch
        );
    }

    get ['Retrofit.Products']() {
        return new Models.Retrofit.Products(
            this.dispatch,
            this['Retrofit.Modes'],
            this['Retrofit.ProductsModels.Parameters'],
            this['Retrofit.Accessories']
        );
    }

    get ['Retrofit.Text']() {
        return new Models.Retrofit.Text(
            this.dispatch
        );
    }

    // ValveSizer Models

    get ['ValveSizer.Actuators']() {
        return new Models.ValveSizer.Actuators(
            this.dispatch
        );
    }

    get ['ValveSizer.Combinations']() {
        return new Models.ValveSizer.Combinations(
            this.dispatch,
            this['ValveSizer.Valves'],
            this['ValveSizer.Actuators'],
            this['User']
        );
    }

    get ['ValveSizer.Properties']() {
        return new Models.ValveSizer.Properties(
            this.dispatch
        );
    }

    get ['ValveSizer.FlowPressure']() {
        return new Models.ValveSizer.FlowPressure(
            this.dispatch,
            this['ValveSizer.Settings'],
            this['ValveSizer.Properties']
        );
    }

    get ['ValveSizer.FlowCalculation']() {
        return new Models.ValveSizer.FlowCalculation(
            this.dispatch,
            this['ValveSizer.Settings'],
            this['ValveSizer.FlowPressure']
        );
    }

    get ['ValveSizer.Settings']() {
        return new Models.ValveSizer.Settings(
            this.dispatch,
            this['User']
        );
    }

    get ['ValveSizer.Series']() {
        return new Models.ValveSizer.Series(
            this.dispatch,
            this['ValveSizer.Properties'],
            this['ValveSizer.FlowPressure'],
            this['ValveSizer.Settings'],
            this['User']
        );
    }

    get ['ValveSizer.Recommendation']() {
        return new Models.ValveSizer.Recommendation(
            this.dispatch,
            this['ValveSizer.Series'],
            this['ValveSizer.Settings'],
            this['ValveSizer.FlowPressure']
        );
    }

    get ['ValveSizer.Products']() {
        return new Models.ValveSizer.Products(
            this.dispatch,
            this['ValveSizer.Series'],
            this['ValveSizer.Combo'],
            this['ValveSizer.Actuators'],
            this['ValveSizer.Recommendation']
        );
    }

    get ['ValveSizer.Combo']() {
        return new Models.ValveSizer.Combo(
            this.dispatch,
            this['ValveSizer.Recommendation'],
            this['ValveSizer.Settings']
        );
    }

    get ['ValveSizer.Valves']() {
        return new Models.ValveSizer.Valves(
            this.dispatch
        );
    }

}

export default ModelsFactory;
