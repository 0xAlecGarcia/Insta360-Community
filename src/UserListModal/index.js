import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';

import { Modal, Icon, List, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';

import UserAvatar from '../UserAvatar/index.js';

import Api from '../utils/Api';

class UserListModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			isFirstLoad: true,
			loading: true,
			hasMore: true,
			currentPage: 1,
			totalPages: 1
		};
	}

	componentDidMount() {
		this.loadUsers();
	}

	loadUsers = async () => {
		const { users, currentPage } = this.state;
		const { type, userId } = this.props;

		const apiMethod =
			type === 'followers' ? Api.getFollowers : Api.getFollowing;

		const response = await apiMethod(userId, currentPage);

		const { data } = response;
		const { list, total_page: totalPages } = data;

		this.setState({
			loading: false,
			isFirstLoad: false,
			users: users.concat(list),
			totalPages
		});
	};

	onLoadMore = () => {
		let { currentPage, totalPages } = this.state;

		if (currentPage < totalPages) {
			currentPage = currentPage + 1;

			this.setState(
				prevState => ({
					loading: true,
					hasMore: currentPage < totalPages,
					currentPage: prevState.currentPage + 1
				}),
				() => {
					this.loadUsers();
				}
			);
		}
	};

	onCancel = () => {
		const { onClose } = this.props;

		if (onClose) {
			onClose();
		}
	};

	render() {
		const { title } = this.props;
		const { isFirstLoad, loading, hasMore, users } = this.state;

		return (
			<Modal
				className="user-list-modal"
				visible
				title={title}
				centered
				footer={null}
				style={{ maxHeight: '70vh ' }}
				onCancel={this.onCancel}
			>
				<InfiniteScroll
					initialLoad={false}
					pageStart={0}
					loadMore={this.onLoadMore}
					hasMore={!loading && hasMore}
					useWindow={false}
				>
					<List
						dataSource={users}
						loading={loading}
						renderItem={item => {
							const { account } = item;
							const { avatar, nickname } = account;

							return (
								<Link to={`/user/${account.id}`}>
									<List.Item key={item.id}>
										<List.Item.Meta
											avatar={<UserAvatar src={avatar} />}
											title={nickname}
										/>
										<Icon type="right" />
									</List.Item>
								</Link>
							);
						}}
					>
						{loading && !isFirstLoad && hasMore && (
							<div className="loading-container">
								<Spin />
							</div>
						)}
					</List>
				</InfiniteScroll>
			</Modal>
		);
	}
}

export default UserListModal;
