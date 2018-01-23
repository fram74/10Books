import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import moment from 'moment';
import socket from 'socket';
import { joinChannel as joinCategoriesChannel } from '../store/actions/categories';
import { joinChannel as joinProductsChannel } from '../store/actions/products';
import * as libraryActions from '../store/actions/products/library';
import SearchContainer from './common/SearchContainer';
import ProductsTableContainer from './common/ProductsTableContainer';
import RateProductModal from '../components/RateProductModal';

class Library extends Component {
  constructor(props) {
    super(props);
    socket.connect();
    props.joinCategoriesChannel();
    props.joinProductsChannel('library');
  }

  state = {
    rateProductWithId: null
  };

  openRateProduct = (productId) => {
    this.setState({ rateProductWithId: productId });
  };

  hideRateProduct = () => {
    this.setState({ rateProductWithId: null });
  };

  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          <SearchContainer />

          <RateProductModal
            show={this.state.rateProductWithId !== null}
            onHide={this.hideRateProduct}
            onSubmit={(value) => {
              this.props.libraryActions.rateProduct(this.state.rateProductWithId, value);
              this.hideRateProduct();
            }}
          />

          <ProductsTableContainer
            appendColumns={[
              {
                title: 'Ratings',
                render: (product) => (
                  <div>{JSON.stringify(product.ratings)}</div>
                )
              },
              {
                title: 'Status',
                thProps: {
                  className: 'text-center'
                },
                tdProps: {
                  className: 'text-center text-nowrap'
                },
                render: (product) => (
                  product.used_by ? (
                    <div>
                      {product.used_by.user.id !== this.props.user.id && (
                        <div>
                          Taken by <b>{product.used_by.user.name}</b>
                          <br />
                          { moment(product.used_by.started_at).fromNow() }
                          <br />
                        </div>
                      )}
                      {product.used_by.user.id === this.props.user.id && (
                        <button
                          className="btn btn-warning"
                          onClick={() => {
                            const isUserRated = product.ratings
                              .find(item => item.user.id === this.props.user.id);

                            if (!isUserRated) {
                              this.openRateProduct(product.id);
                            }

                            this.props.libraryActions.returnProduct(product.id);
                          }}
                        >
                          Return book
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.props.libraryActions.takeProduct(product.id)
                      }}
                    >
                      Take book
                    </button>
                  )
                )
              }
            ]}
          />
        </div>
      </Provider>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ joinProductsChannel, joinCategoriesChannel }, dispatch),
    libraryActions: bindActionCreators(libraryActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Library);